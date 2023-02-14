import { SCP } from '@secretarium/connector';
import { useState } from 'react';
import './app.css';
import styles from './app.module.css';
import SecretariumProvider from './components/aport/SecretariumProvider';
import Test from './components/test';
import AnotherTest from './components/anotherTest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient()

const App: React.FC = () => {

    const [secretariumClient] = useState(() => new SCP());
    const [queryClient] = useState(() => new QueryClient());

    return (
        <SecretariumProvider connector={secretariumClient}>
            <QueryClientProvider client={queryClient}>
                <div className={styles.container}>
                    <div className={styles.box}>
                        <h1>Hello there</h1>
                        <Test />
                        {/* <span>{isConnected}</span> */}
                    </div>
                    <div className={styles.box}>
                        <h1>Hi!</h1>
                        <AnotherTest />
                    </div>
                </div>
            </QueryClientProvider>
        </SecretariumProvider>
    );
}

export default App;
