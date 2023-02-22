import { useContext } from 'react';
import { SecretariumContext } from './SecretariumContext';
import { useQuery } from '@tanstack/react-query';
import { Query } from './types';

// type Result = {
//     platform_statistics: {
//         committed_quantity: number;
//         detokenization_quantity: number;
//         tokenization_quantity: number;
//         total_bid_quantity: number;
//         total_quantity: number;
//         transfered_quantity: number;
//         start: number;
//         end: number;
//     }
// };

export const useSecretariumQuery = (props: Query) => {
    const { connector } = useContext(SecretariumContext);

    const getStats = () => connector!.request({
        application: props.app,
        route: props.route
    }, props.args)
        .then(request => request
            .onResult(result => result)
            .onError((queryError: any) => {
                console.error('🔴 OOPS: ', queryError);
                throw new Error(`Transaction error: ${queryError?.message?.toString() ?? queryError?.toString()}`);
            })
            .send());
        // .catch(() => console.error('🔴 OOPS!'));

    const { isLoading, data, error } = useQuery({
        queryKey: ['test'],
        queryFn: getStats,
        retry: true,
        retryDelay: 5000,
        cacheTime: 0
    });

    console.log('🏃 <<< RUNNING >>> 🏃', isLoading, data, error);

    return { isLoading, data, error };
};

export default useSecretariumQuery;