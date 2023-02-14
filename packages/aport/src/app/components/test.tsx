import { Constants, Key } from '@secretarium/connector';
import React, { useEffect, useState, useContext } from 'react';
import { SecretariumContext } from './aport/SecretariumContext';

const isDev = process.env.NODE_ENV === 'development';

const Test: React.FC = () => {

    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string>();
    const [hasInitialisedKey, setHasInitialisedKey] = useState(false);
    const [key, setKey] = useState<any>();

    const { connector } = useContext(SecretariumContext);

    // Check if connection is already established
    useEffect(() => {
        if (key && connector?.state === Constants.ConnectionState.secure) {
            console.log('✅ Connection aleady established');
            setIsConnected(true);
        }
    }, [key]);

    // Generate key
    useEffect(() => {
        if (!hasInitialisedKey && !key) {
            console.log('🔴 No key set');
            Key.createKey()
                .then((keyPair: any) => {
                    console.log('🔑 Setting key');
                    setKey(keyPair);
                })
                .catch((error: any) => {
                    setError(isDev ? `Key generation error: ${error?.message?.toString() ?? error?.toString()}` : 'Oops, a problem occured');
                });
            console.log('🔑 ✅ Key initialised');
            setHasInitialisedKey(true);
        }
    }, []);

    // Connect to backend
    async function connectBackend() {
        console.log('Connecting...');
        if (key && connector?.state === Constants.ConnectionState.closed) {
            connector?.connect('wss://ovh-uk-eri-2288-5.node.secretarium.org', key, 'rliD_CISqPEeYKbWYdwa-L-8oytAPvdGmbLC0KdvsH-OVMraarm1eo-q4fte0cWJ7-kmsq8wekFIJK0a83_yCg==').then(() => {
                setIsConnected(true);
                console.log('✅ Connected');
            }).catch((error) => {
                console.log(`🔴 ERR! ${error}`);
                setError(isDev ? `Connection error: ${error?.message?.toString() ?? error?.toString()}` : 'Oops, a problem occured');
                setIsConnected(false);
            });
        }
    }
    // useEffect(() => {
    //     async function connectBackend() {
    //         if (key && connector?.state === Constants.ConnectionState.closed) {
    //             connector?.connect('wss://ovh-uk-eri-2288-5.node.secretarium.org', key, 'rliD_CISqPEeYKbWYdwa-L-8oytAPvdGmbLC0KdvsH-OVMraarm1eo-q4fte0cWJ7-kmsq8wekFIJK0a83_yCg==').then(() => {
    //                 setIsConnected(true);
    //             }).catch((error) => {
    //                 setError(isDev ? `Connection error: ${error?.message?.toString() ?? error?.toString()}` : 'Oops, a problem occured');
    //                 setIsConnected(false);
    //             });
    //         }
    //     }
    //     connectBackend();
    // }, [key]);

    const handleConnect = () => connectBackend();

    return (
        <div>
            <button onClick={handleConnect}>
                Connect
            </button>
            <div>
                {isConnected ? '✅ Connected' : `🔴 Not connected: ${error}`}
            </div>
        </div>
    );
};

export default Test;