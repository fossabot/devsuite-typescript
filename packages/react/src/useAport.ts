import { useContext } from 'react';
import SecretariumContext from './SecretariumContext';
import { Query } from './types';
import { useQuery, UseQueryOptions, QueryKey } from '@tanstack/react-query';

export function useAport<
    TQueryFnData,
    TError,
    TData = TQueryFnData,
    TQueryKey extends QueryKey = QueryKey,
>(
    queryKey: TQueryKey,
    query: Query,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        'queryKey' | 'queryFn'
    >
) {
    const { connector /*, options: globalOptions */ } = useContext(SecretariumContext);

    if (!connector)
        throw new Error('Connector is not initialised');

    return useQuery({
        queryKey,
        queryFn: async () => {

            return connector.request({
                application: query.app,
                route: query.route
            }, query.args)
                .then(request => request
                    .onResult(result => result)
                    .onError((queryError: any) => {
                        throw new Error(`Transaction failed - ${queryError?.message?.toString() ?? queryError?.toString()}`);
                    })
                    .send()) as TQueryFnData;
        },
        ...options
    });
}