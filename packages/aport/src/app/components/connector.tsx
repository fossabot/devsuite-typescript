import { useEffect, useState } from 'react';
import { Key, SCP, Constants } from '@secretarium/connector';
import { useQueryClient } from '@tanstack/react-query';

const scp = new SCP();
const isDev = process.env.NODE_ENV === 'development';

export const useConnection = () => {
    const queryClient = useQueryClient();

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [hasInitialisedKey, setHasInitialisedKey] = useState<boolean>(false);
    const [key, setKey] = useState<any>();
    const [result, setResult] = useState<any>();

    // Check if connection is already established
    useEffect(() => {
        if (key && scp.state === Constants.ConnectionState.secure)
            setIsConnected(true);
    }, [key]);

    // Generate key
    useEffect(() => {
        if (!hasInitialisedKey && !key) {
            Key.createKey()
                .then((keyPair: any) => {
                    setKey(keyPair);
                })
                .catch((error: any) => {
                    setError(isDev ? `Key generation error: ${error?.message?.toString() ?? error?.toString()}` : 'Oops, a problem occured');
                });
            setHasInitialisedKey(true);
        }
    }, []);

    // Connect to backend
    useEffect(() => {
        async function connectBackend() {
            if (key && scp.state === Constants.ConnectionState.closed) {
                scp.connect('wss://ovh-uk-eri-2288-5.node.secretarium.org', key, 'rliD_CISqPEeYKbWYdwa-L-8oytAPvdGmbLC0KdvsH-OVMraarm1eo-q4fte0cWJ7-kmsq8wekFIJK0a83_yCg==').then(() => {
                    setIsConnected(true);
                }).catch((error) => {
                    setError(isDev ? `Connection error: ${error?.message?.toString() ?? error?.toString()}` : 'Oops, a problem occured');
                    setIsConnected(false);
                });
            }
        }
        connectBackend();
    }, [key]);

    // Get platform stats
    useEffect(() => {
        if (isConnected) {
            const command = 'get-platform-statistics';
            const query = scp.newTx('stts', 'get-platform-statistics', `stts_get_statistics_${Date.now()}`, {});
            query.onResult?.((result: any) => {
                queryClient.invalidateQueries({ queryKey: [command] });
                setResult(result.platform_statistics.current_period);
            });
            query.onError?.((error: any) => {
                setError(isDev ? `Transaction error: ${error?.message?.toString() ?? error?.toString()}` : 'Oops, a problem occured');
                setIsConnected(false);
            });
            query.send?.()
                .catch((error) => {
                    setError(isDev ? `Transaction error: ${error?.message?.toString() ?? error?.toString()}` : 'Oops, a problem occured');
                    setIsConnected(false);
                });
        }
    }, [isConnected]);

    return isConnected ? `✅ Connected: ${result}` : `🔴 Not connected: ${error}`;
};