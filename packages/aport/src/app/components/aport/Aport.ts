import { SecretariumConnector } from '@secretarium/connector';
import { useQuery } from '@tanstack/react-query';
import { Query } from './types';

type AportProps = {
    kem: 'rsa' | 'kyber';
    url: string;
    trustKey: string;
};

type DummyType = {
    res: string;
};

export const Aport = (key: string, params: Query, connection: AportProps) => {

    //const queryClient = new QueryClient();

    const connector = new SecretariumConnector({
        connection: {
            kem: connection.kem,
            url: connection.url,
            trustKey: connection.trustKey
        }
    });

    return useQuery({
        queryKey: [key],
        queryFn: () => {
            if (!connector.isConnected)
                throw new Error('🔴 ERR! No connection...');
            return connector.request({
                application: params.app,
                route: params.route
            }, params.args)
                .then(request => request
                    .onResult<DummyType>(result => result)
                    .onError((queryError: any) => {
                        console.error('🔴 OOPS: ', queryError);
                        throw new Error(`Transaction error: ${queryError?.message?.toString() ?? queryError?.toString()}`);
                    })
                    .send());
        },
        enabled: false
    });

};