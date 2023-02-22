import React from 'react';
import { Aport } from './aport/Aport';

const foo: React.FC = () => {

    const { isLoading, data, error, refetch } = Aport(
        'stats',
        {
            app: 'stts',
            route: 'get-platform-statistics',
            args: {}
        },
        {
            kem: 'rsa',
            url: 'wss://ovh-uk-eri-2288-5.node.secretarium.org',
            trustKey: 'lliD_CISqPEeYKbWYdwa-L-8oytAPvdGmbLC0KdvsH-OVMraarm1eo-q4fte0cWJ7-kmsq8wekFIJK0a83_yCg=='
        });

    const handleClick = () => refetch();

    if (error) {
        return <p>{`${error}`}</p>;
    }

    return <div>
        <button onClick={handleClick}>Click me</button>
        {isLoading ? <p>Loading...</p> : null}
        {data ? <p>{`✅ Result: ${JSON.stringify(data)}`}</p> : null}
    </div>;
};

export default foo;