import { useWallet } from '@solana/wallet-adapter-react';
import React, { useCallback, useMemo } from 'react';

function BaseWalletDisconnectButton({children, disabled, onClick, ...props}) {
    const { wallet, disconnect, disconnecting } = useWallet();
    const handleClick = useCallback(
        (event) => {
            if (onClick) onClick(event);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            if (!event.defaultPrevented)
                disconnect().catch(() => {
                    // Silently catch because any errors are caught by the context `onError` handler
                });
        },
        [onClick, disconnect]
    );

    const content = useMemo(() => {
        if (children) return children;
        if (disconnecting) return 'Disconnecting ...';
        if (wallet) return 'Disconnect';
        return 'Disconnect Wallet';
    }, [children, disconnecting, wallet]);

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={disabled || !wallet}
                {...props}
            >{content}</button>
        </div>
    );
}

export default BaseWalletDisconnectButton;