import { useContext } from 'react';
import SecretariumContext from './SecretariumContext';
import { Query } from './types';

export const useSecretarium = <TData>(query: Query) => {

    const { connector /*, options: globalOptions */ } = useContext(SecretariumContext);

    if (!connector)
        throw new Error('Connector is not initialised');
    // if (!connector.isConnected)
    //     throw new Error('Cannot establish a connection');
    //console.log(connector);
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