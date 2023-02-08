import { DeploymentPushPayload, DeploymentPullRequestPayload } from '@secretarium/hubber-api';
import { prisma } from '@secretarium/hubber-db';
import type { KlaveRcConfiguration } from '@secretarium/trustless-app';
import { Utils } from '@secretarium/connector';
import path from 'path';
import type { Context } from 'probot';
import * as asb from 'asbuild';
import secretariumClient from '../../utils/secretarium';

type DeploymentContext<Type> = {
    octokit: Context['octokit']
} & Type;

export const deployToSubstrate = async ({ octokit, ...context }: DeploymentContext<DeploymentPushPayload>) => {

    const { data: { files } } = await octokit.repos.compareCommits({
        owner: context.repo.owner,
        repo: context.repo.name,
        base: context.commit.before,
        head: context.commit.after
    });

    if (!files)
        return;

    const repo = await prisma.repo.findUnique({
        include: {
            applications: true
        },
        where: {
            owner_name: {
                name: context.repo.name,
                owner: context.repo.owner
            }
        }
    });

    if (!repo)
        return;

    const availableApplicationsConfig = (repo.config as unknown as KlaveRcConfiguration).applications.reduce((prev, current) => {
        prev[current.name] = current;
        return prev;
    }, {} as Record<string, KlaveRcConfiguration['applications'][number]>);

    repo.applications.forEach(async application => {

        if (files.filter(({ filename }) => {
            const commitFileDir = path.normalize(path.join('/', filename));
            const appPath = path.normalize(path.join('/', availableApplicationsConfig[application.name].rootDir ?? ''));
            return commitFileDir.startsWith(appPath) || filename === '.klaverc.json';
        }).length === 0)
            return;

        await prisma.activityLog.create({
            data: {
                class: 'pushHook',
                application: {
                    connect: {
                        id: application.id
                    }
                },
                context: {
                    type: context.type,
                    payload: context
                }
            }
        });
        const launchDeploy = async () => {
            const deployment = await prisma.deployment.create({
                data: {
                    version: context.commit.after.substring(0, 8),
                    locations: ['FR'],
                    application: {
                        connect: { id: application.id }
                    }
                }
            });
            await prisma.activityLog.create({
                data: {
                    class: 'deployment',
                    application: {
                        connect: {
                            id: application.id
                        }
                    },
                    context: {
                        type: 'start',
                        payload: {
                            deploymentId: deployment.id
                        }
                    }
                }
            });

            (new Promise((resolve, reject) => {
                setTimeout(reject, 180000);
                return prisma.deployment.update({
                    where: {
                        id: deployment.id
                    },
                    data: {
                        status: 'deploying'
                    }
                });
            })).catch(async () => {
                const currentState = await prisma.deployment.findUnique({
                    where: {
                        id: deployment.id
                    }
                });
                if (currentState?.status !== 'deployed')
                    await prisma.deployment.update({
                        where: {
                            id: deployment.id
                        },
                        data: {
                            status: 'errored'
                        }
                    });
            });

            try {

                const handle = await octokit.repos.getContent({
                    owner: repo.owner,
                    repo: repo.name,
                    ref: context.commit.ref,
                    path: `${availableApplicationsConfig[application.name].rootDir}`,
                    mediaType: {
                        format: 'raw+json'
                    }
                });

                const availableFiles = Array.isArray(handle.data) ? handle.data : [];
                const compilableFiles = availableFiles.find(file => ['index.ts'].includes(file.name));

                const source = await octokit.repos.getContent({
                    owner: repo.owner,
                    repo: repo.name,
                    ref: context.commit.ref,
                    path: `${compilableFiles?.path}`,
                    mediaType: {
                        format: 'raw+json'
                    }
                });

                let compileBinary = new Uint8Array(0);
                const compileOutput = await new Promise((resolve) => {
                    asb.main([
                        'build',
                        '.',
                        '--wat'
                    ], {
                        stdout: process.stdout,
                        stderr: process.stderr,
                        reportDiagnostic: (diagnostic) => {
                            console.log(diagnostic);
                            console.log(diagnostic.message);
                        },
                        readFile(filename, baseDir) {
                            console.log('Reading the CODE CONTENT...', filename, baseDir);
                            if (filename === 'asconfig.json')
                                return '{}';
                            console.log('Reading the CODE CONTENT...', source.data.toString());
                            return source.data.toString();
                        },
                        writeFile(filename, contents) {
                            console.log('Writing the content off the compiler', filename);
                            compileBinary = contents;
                        }
                    }, result => {
                        console.log('Compilation output', result);
                        resolve(result);
                        return 0;
                    });
                });

                console.log('AFTER COMPILE COMPILATION', compileOutput);
                console.log('>>>>>>>\n', compileBinary.length);

                await secretariumClient.newTx('wasm-app', 'register_smart_contract', `klave-deployment-${deployment.id}`, {
                    name: `${deployment.id.split('-').pop()}.sta.klave.network`,
                    wasm_bytes: [],
                    wasm_bytes_b64: Utils.toBase64(compileBinary)
                }).onExecuted(async () => {
                    return await prisma.deployment.update({
                        where: {
                            id: deployment.id
                        },
                        data: {
                            status: 'deployed',
                            life: 'long',
                            released: true
                        }
                    });
                }).onError((error) => {
                    console.error('Secretarium failed', error);
                    // Timeout will eventually error this
                }).send();

                console.log('DEPLOYEMENT FINISHED', compileOutput);

            } catch (error) {
                // Timeout will eventually error this
            }
        };

        if (context.class === 'push')
            launchDeploy().finally(() => { return; });
    });

    return;
};

export const updatePullRequestFromSubstrate = async ({ octokit, ...context }: DeploymentContext<DeploymentPullRequestPayload>) => {

    const { data: { files } } = await octokit.repos.compareCommits({
        owner: context.repo.owner,
        repo: context.repo.name,
        base: context.commit.before,
        head: context.commit.after
    });

    if (!files?.length)
        return;

    const repo = await prisma.repo.findUnique({
        include: {
            applications: true
        },
        where: {
            owner_name: {
                name: context.repo.name,
                owner: context.repo.owner
            }
        }
    });

    if (!repo)
        return;

    const availableApplicationsConfig = (repo.config as unknown as KlaveRcConfiguration).applications.reduce((prev, current) => {
        prev[current.name] = current;
        return prev;
    }, {} as Record<string, KlaveRcConfiguration['applications'][number]>);

    repo.applications.forEach(async application => {

        // console.log(application, files, repo);

        if (files.filter(({ filename }) => {
            const commitFileDir = path.normalize(path.join('/', filename));
            const appPath = path.normalize(path.join('/', availableApplicationsConfig[application.name].rootDir ?? ''));
            return commitFileDir.startsWith(appPath) || filename === '.klaverc.json';
        }).length === 0)
            return;

        await prisma.activityLog.create({
            data: {
                class: 'pullRequestHook',
                application: {
                    connect: {
                        id: application.id
                    }
                },
                context: {
                    type: context.type,
                    payload: context
                }
            }
        });
    });

    return;
};