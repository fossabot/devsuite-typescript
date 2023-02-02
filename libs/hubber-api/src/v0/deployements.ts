import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '../trpc';

export const deployementRouter = createTRPCRouter({
    getByApplication: publicProcedure
        .input(z.object({
            appId: z.string().uuid()
        }))
        .query(async ({ ctx: { prisma }, input: { appId } }) => {

            if (!appId)
                return [];

            return await prisma.deployement.findMany({
                where: {
                    applicationId: appId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 20
            });

        }),
    getAll: publicProcedure
        .query(async ({ ctx: { prisma, webId } }) => {

            const domainList = await prisma.deployement.findMany({
                where: {
                    application: {
                        webId
                    }
                }
            });

            return domainList;
        })
});

export default deployementRouter;