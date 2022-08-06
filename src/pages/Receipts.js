import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";

function Receipts() {
    const location = useLocation();
    const [tokens, setTokens] = useState([]);
    const [isRightAddress, setIsRightAddress] = useState(true);


    useEffect( () => {
        let walletPubkey = location.pathname.split('/')[2];
        const walletToQuery = new PublicKey(walletPubkey);
        const programId = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
        const connection = new Connection(clusterApiUrl("devnet"), 'confirmed');
        connection.getTokenAccountsByOwner(walletToQuery, { programId: programId, encoding: "jsonParsed", commitment: "processed"}).then(
            (response) => {
                const tokens = response.value.map( each => {
                    console.log(each);
                    return each.pubkey.toBase58()
            })
                setTokens(tokens);
            }
        ).catch()
    }, []);

    return (
        <div>
            { isRightAddress && tokens.map( (token,index) => (
                <div key={index}>
                    {token}
                </div>
            ))}
        </div>
    );
}

export {Receipts};