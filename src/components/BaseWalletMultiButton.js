import { useWallet } from '@solana/wallet-adapter-react';
import React, { useMemo, useState } from 'react';
import { useBaseWalletDialog } from '../hooks';
import { WalletConnectButton } from './BaseWalletConnectButton';

function BaseWalletMultiButton({children, ...props }) {
    const { publicKey, wallet, disconnect } = useWallet();
    const { setOpen } = useBaseWalletDialog();


    return (
        <div>
            
        </div>
    );
}
export default BaseWalletMultiButton;