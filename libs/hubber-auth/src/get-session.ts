import type {
    GetServerSidePropsContext,
    NextApiRequest,
    NextApiResponse
} from 'next';
import { unstable_getServerSession } from 'next-auth';

import { authOptions } from './auth-options';

export const getServerAuthSession = async (
    ctx:
        | {
            req: GetServerSidePropsContext['req'];
            res: GetServerSidePropsContext['res'];
        }
        | { req: NextApiRequest; res: NextApiResponse }
) => {
    return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
};