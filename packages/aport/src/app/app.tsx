//import { SecretariumConnector } from '@secretarium/connector';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import './app.css';
import styles from './app.module.css';
//import SecretariumProvider from './components/aport/SecretariumProvider';
import Foo from './components/foo';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const connector = new SecretariumConnector({
//     connection: {
//         kem: 'rsa',
//         url: 'wss://ovh-uk-eri-2288-5.node.secretarium.org',
//         trustKey: 'rliD_CISqPEeYKbWYdwa-L-8oytAPvdGmbLC0KdvsH-OVMraarm1eo-q4fte0cWJ7-kmsq8wekFIJK0a83_yCg=='
//     }
// });

const App: React.FC = () => {

    const [queryClient] = useState(() => new QueryClient());

    return (
        // <SecretariumProvider connector={connector}>
        <QueryClientProvider client={queryClient}>
            <div className={styles.container}>
                <div className={styles.box}>
                    <h1>Hello there</h1>
                    <Foo />
                </div>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
        // </SecretariumProvider>
    );
};

export default App;
