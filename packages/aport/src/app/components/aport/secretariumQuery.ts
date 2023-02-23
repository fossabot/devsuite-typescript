import { Connector } from '@secretarium/connector';
import { Query } from './types';

export const secretariumQuery = <TData>(connector: Connector, query: Query) => {

    return connector.request({
        application: query.app,
        route: query.route
    }, query.args)
        .then(request => request
            .onResult(result => result)
            .onError((queryError: any) => {
                console.error('🔴 OOPS: ', queryError);
                throw new Error(`Transaction error: ${queryError?.message?.toString() ?? queryError?.toString()}`);
            })
            .send()) as unknown as TData;
};