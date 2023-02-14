

import { useMemo } from 'react';
import type { FC } from 'react';
import { SCP } from '@secretarium/connector';
import type { SecretariumContextValue, SecretariumProviderProps } from './types';
import { SecretariumContext } from './SecretariumContext';

export const SecretariumProvider: FC<SecretariumProviderProps> = ({
    children,
    connector
}) => {

    const defaults = useMemo<SecretariumContextValue>(
        () => ({
            connector: connector ?? new SCP()
        }),
        [connector]
    );

    return (
        <SecretariumContext.Provider value={defaults}>
            {children}
        </SecretariumContext.Provider>
    );

    // return <SecretariumContext.Provider value={defaults}>
    //     {children}
    //     </SecretariumContext.Provider>;
};

export default SecretariumProvider;