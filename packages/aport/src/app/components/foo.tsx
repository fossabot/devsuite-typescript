import React from 'react';
// import { Aport } from './aport/Aport';
// import { secretariumQuery } from './aport/secretariumQuery';
import { useAport } from '@secretarium/react';

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

    // const connector = useConnector();

    // if (!connector)
    //     return <p>Connector is not initialised</p>;

    const query = {
        app: 'stts',
        route: 'get-platform-statistic',
        args: {}
    };

    // const { data, error, refetch, fetchStatus } = Aport(
    //     [query.route],
    //     async () => secretariumQuery<Stats>(connector, query),
    //     {
    //         enabled: false
    //     }
    // );

    const { data, error, refetch, fetchStatus } = useAport<Stats, Error>([query.route], query, { enabled: false });

    const handleClick = () => refetch();

    if (error) {
        return <div>
            <button onClick={handleClick}>Click me</button>
            <p>An error has occurred: <b>{`${error}`}</b></p>
        </div>;
    }

    if (fetchStatus === 'fetching') {
        return <p>Loading...</p>;
    }

    return <div>
        <button onClick={handleClick}>Click me</button>
        {data ? <p>{`✅ Total quantity enferumized: ${JSON.stringify(data.platform_statistics.current_period.total_quantity)}`}</p> : null}
    </div>;
};

export default Foo;