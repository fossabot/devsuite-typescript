import React, { useContext, useEffect, useState } from 'react';
import { SecretariumContext } from './aport/SecretariumContext';

//const isDev = process.env.NODE_ENV === 'development';

const Test: React.FC = () => {

    const [isConnected, setIsConnected] = useState(false);
    // const [error, setError] = useState<string>();
    // const [hasInitialisedKey, setHasInitialisedKey] = useState(false);
    // const [key, setKey] = useState<any>();

    const { connector } = useContext(SecretariumContext);

    // Check if connection is already established
    useEffect(() => {
        if (connector?.isConnected) {
            setIsConnected(connector.isConnected);
        }
    }, [connector?.isConnected]);

    // Generate key
    // useEffect(() => {
    //     if (!hasInitialisedKey && !key) {
    //         console.log('🔴 No key set');
    //         Key.createKey()
    //             .then((keyPair: any) => {
    //                 console.log('🔑 Setting key');
    //                 setKey(keyPair);
    //             })
    //             .catch((error: any) => {
    //                 setError(isDev ? `Key generation error: ${error?.message?.toString() ?? error?.toString()}` : 'Oops, a problem occured');
    //             });
    //         console.log('🔑 ✅ Key initialised');
    //         setHasInitialisedKey(true);
    //     }
    // }, []);

    // Connect to backend
    // async function connectBackend() {
    //     console.log('Connecting...');
    //     if (key && !connector?.isConnected) {
    //         connector?.connect('wss://ovh-uk-eri-2288-5.node.secretarium.org', key, 'rliD_CISqPEeYKbWYdwa-L-8oytAPvdGmbLC0KdvsH-OVMraarm1eo-q4fte0cWJ7-kmsq8wekFIJK0a83_yCg==').then(() => {
    //             setIsConnected(true);
    //             console.log('✅ Connected');
    //         }).catch((error) => {
    //             console.log(`🔴 ERR! ${error}`);
    //             setError(isDev ? `Connection error: ${error?.message?.toString() ?? error?.toString()}` : 'Oops, a problem occured');
    //             setIsConnected(false);
    //         });
    //     }
    // }

    //const handleConnect = () => connectBackend();

    return (
        <div>
            {/* <button onClick={handleConnect}>
                Connect
            </button> */}
            <div>
                {isConnected ? '✅ Connected' : '🔴 Not connected'}
            </div>
        </div>
    );
};

export default Test;