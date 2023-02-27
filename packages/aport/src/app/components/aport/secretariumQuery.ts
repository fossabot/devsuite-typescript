import { Connector } from '@secretarium/connector';
import { Query } from './types';

export const secretariumQuery = <TData>(connector: Connector, query: Query) => {
    // if (!connector.isConnected)
    //     throw new Error('Cannot establish a connection');
    console.log(connector);
    return connector.request({
        application: query.app,
        route: query.route
    }, query.args)
        .then(request => request
            .onResult(result => result)
            .onError((queryError: any) => {
                throw new Error(`Transaction failed - ${queryError?.message?.toString() ?? queryError?.toString()}`);
            })
            .send()) as TData;
};