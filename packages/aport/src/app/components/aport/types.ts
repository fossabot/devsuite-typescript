import type { ReactNode } from 'react';
import { SCP } from '@secretarium/connector';
import type { Transaction } from '@secretarium/connector';

export type QueryOptions<TBase> = TBase & {
    timeout?: number;
    cacheLife?: number;
    persist?: boolean;
    suspense?: boolean;
}

export type Query = {
    app: string;
    route: string;
    args?: Record<string, any>
}

export type SecretariumContextValue = {
    connector?: SCP;
}

export type SecretariumOptions = {
    transformers?: {
        inbound?: () => void;
        outbound?: () => void;
    }
};

export type SecretariumProviderProps = {
    children: ReactNode;
} & ({
    // link?: LinkImplementation;
    // connections?: Server | Array<Server>;
    // options?: SecretariumOptions;
    connector?: SCP;
    options?: never;
} | {
    connector?: never;
    options?: never;
})

export interface DoFetchArgs {
    url: string
    options: RequestInit
    response: {
        isCached: boolean
        id: string
        cached?: Response
    }
}

export interface Connector {
    version: string;
    isConnected: boolean;
    request(command: {
        application: string,
        route: string
        explicit?: string
    }, args?: Record<string, any>, subscribe?: boolean): Promise<Transaction>;
}