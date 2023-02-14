import React, { useEffect, useState, useContext } from 'react';
import { SecretariumContext } from './aport/SecretariumContext';
import useSecretariumQuery from './aport/useSecretariumQuery';

const AnotherTest: React.FC = () => {

    const [status, setStatus] = useState<any>();
    //const [stats, setStats] = useState<any>();
    //const [error, setError] = useState<string>();

    const { connector } = useContext(SecretariumContext);
    const { data, isLoading, error } = useSecretariumQuery({ app: 'stts', route: 'get-platform-statistics', args: {} });

    useEffect(() => {
        setStatus(connector?.state);
    }, [connector]);

    // const handleQuery = () => {
    //     console.log('Running...');
    //     setError(undefined);
    //     const query = connector?.newTx('stts', 'get-platform-statistics', `stts_get_statistics_${Date.now()}`, {});
    //     query?.onResult?.((result: any) => {
    //         setStats(JSON.stringify(result.platform_statistics.current_period.total_quantity));
    //     });
    //     query?.onError?.((error: any) => {
    //         setError(`Transaction error: ${error?.message?.toString() ?? error?.toString()}`);
    //     });
    //     query?.send?.()
    //         .catch((error) => {
    //             setError(`Transaction error: ${error?.message?.toString() ?? error?.toString()}`);
    //         });
    // }

    if (error) {
        return <p>{`🔴 ERR! ${error}`}</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return <p>{`✅ Result: ${data}`}</p>;
};

export default AnotherTest;