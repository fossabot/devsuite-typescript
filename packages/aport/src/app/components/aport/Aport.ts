import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function Aport<
    TQueryKey extends [string, Record<string, unknown>?],
    TQueryFnData,
    TError,
    TData = TQueryFnData
>(
    queryKey: TQueryKey,
    secretariumQueryFn: (params: TQueryKey[1]) => Promise<TQueryFnData>,
    options?: Omit<
        UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
        'queryKey' | 'queryFn'
    >
) {

    return useQuery({
        queryKey,
        queryFn: async () => secretariumQueryFn(queryKey[1]),
        ...options
    });
}