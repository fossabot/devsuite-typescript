import React from 'react';
import { Aport } from './aport/Aport';
import { secretariumQuery } from './aport/secretariumQuery';
import { useConnector } from '@secretarium/react';

type Stats = {
    platform_statistics: {
        current_period: {
            committed_quantity: number;
            detokenization_quantity: number;
            tokenization_quantity: number;
            total_bid_quantity: number;
            total_quantity: number;
            transfered_quantity: number;
            start: number;
            end: number;
        }
    }
};

const Foo: React.FC = () => {

    const connector = useConnector();

    if (!connector)
        return <p>Connector is not initialised</p>;

    const query = {
        app: 'stts',
        route: 'get-platform-statistics',
        args: {}
    };

    const { isLoading, data, error, refetch } = Aport(
        [query.route],
        async () => secretariumQuery<Stats>(connector, query),
        { enabled: false }
    );

    const handleClick = () => refetch();

    if (error) {
        return <p>{`${error}`}</p>;
    }

    return <div>
        <button onClick={handleClick}>Click me</button>
        {isLoading ? <p>Loading...</p> : null}
        {data ? <p>{`✅ Total quantity enferumized: ${JSON.stringify(data.platform_statistics.current_period.total_quantity)}`}</p> : null}
    </div>;
};

export default Foo;

// async function getStats(connection: Connection, query: Query): Promise<Stats> {
//     const connector = new SecretariumConnector({
//         connection: {
//             kem: connection.kem,
//             url: connection.url,
//             trustKey: connection.trustKey
//         }
//     });

//     return connector.request({
//         application: query.app,
//         route: query.route
//     }, query.args)
//         .then(request => request
//             .onResult(result => result)
//             .onError((queryError: any) => {
//                 console.error('🔴 OOPS: ', queryError);
//                 throw new Error(`Transaction error: ${queryError?.message?.toString() ?? queryError?.toString()}`);
//             })
//             .send()) as unknown as Stats;
// }