import { createContext, useContext } from 'react';

export interface WalletDialogContextState {
    open: boolean;
    setOpen: (open: boolean) => void;
}

export const WalletDialogContext = createContext({});

export function useBaseWalletDialog(): WalletDialogContextState {
    return useContext(WalletDialogContext);
}