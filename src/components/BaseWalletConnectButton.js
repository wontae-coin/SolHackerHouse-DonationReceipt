import { useWallet } from '@solana/wallet-adapter-react';
import React, { useCallback, useMemo } from 'react';

function BaseWalletConnectButton({children, disabled, onClick, ...props}) {
    const { wallet, connect, connecting, connected } = useWallet();

    const handleClick = useCallback(
        (event) => {
            if (onClick) onClick(event);
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            if (!event.defaultPrevented)
                connect().catch(() => {
                    // Silently catch because any errors are caught by the context `onError` handler
                });
        },
        [onClick, connect]
    );

    const content = useMemo(() => {
        if (children) return children;
        if (connecting) return 'Connecting ...';
        if (connected) return 'Connected';
        if (wallet) return 'Connect';
        return 'Connect Wallet';
    }, [children, connecting, connected, wallet]);

    return (
        <div>
            <button
                onClick={handleClick}
                disabled={disabled || !wallet || connecting || connected}
                {...props}
            >{content}</button>
        </div>
    );
}

export {BaseWalletConnectButton};