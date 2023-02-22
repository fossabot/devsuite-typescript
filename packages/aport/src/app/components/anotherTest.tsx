import React from 'react';
import useSecretariumQuery from './aport/useSecretariumQuery';

const AnotherTest: React.FC = () => {

    // const [, setStatus] = useState<any>();
    //const [stats, setStats] = useState<any>();
    //const [error, setError] = useState<string>();

    //const { connector } = useContext(SecretariumContext);
    const { data, isLoading, error } = useSecretariumQuery({ app: 'stts', route: 'get-platform-statistics', args: {} });

    if (error) {
        return <p>{`🔴 ERR! ${error}`}</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    return <p>{`✅ Result: ${JSON.stringify(data)}`}</p>;
};

export default AnotherTest;