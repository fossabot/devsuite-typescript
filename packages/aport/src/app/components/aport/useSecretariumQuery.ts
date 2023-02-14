import { useContext } from 'react';
import { SecretariumContext } from './SecretariumContext';
import { useQuery } from '@tanstack/react-query';
import { Query } from './types';

export const useSecretariumQuery = (props: Query) => {
    const { connector } = useContext(SecretariumContext);

    const { isLoading, data, error } = useQuery({
        queryKey: ['test'],
        queryFn: () => {
            console.log('🔃 Refetching...');
            let data;
            const query = connector?.newTx('stts', 'get-platform-statistics', `stts_get_statistics_${Date.now()}`, {});
            // write request
            query?.onResult?.((result: any) => {
                console.log('✅ RESULT: ', result);
                data = result.platform_statistics.current_period.total_quantity;
                //return data;
            });
            query?.onError?.((queryError: any) => {
                console.error('🔴 OOPS: ', queryError);
                throw new Error(`Transaction error: ${queryError?.message?.toString() ?? queryError?.toString()}`);
                //return error;
            });
            query?.send?.()
                .catch((queryError) => {
                    console.error('🔴 OOPS: ', queryError);
                    throw new Error(`Transaction error: ${queryError?.message?.toString() ?? queryError?.toString()}`);
                    //return error;
                });
            return data;
        },
        retry: true,
        retryDelay: 1000
    })

    console.log('🏃 <<< RUNNING >>> 🏃', isLoading, data, error);

    return { isLoading, data, error };
};

export default useSecretariumQuery;