import { useState } from 'react';
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import {Alert} from '@mui/material';

function useGetTokens(walletPubkey) {
    const [tokens, setTokens] = useState([]);
    console.log(walletPubkey);
    const walletToQuery = new PublicKey(walletPubkey);
    const programId = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
    async function getTokens() {
        const connection = new Connection(clusterApiUrl("mainnet-beta"), 'confirmed');
        const response = await connection.getTokenAccountsByOwner(walletToQuery, { programId: programId, encoding: "jsonParsed", commitment: "processed"});
        const tokens = response.value.map( each => (
            each.pubkey.toBase58()
        ))

        setTokens(tokens);
        // 토큰 확인 부분 차후 삭제 필요
        alert(tokens);
        console.log('Received tokens : ', tokens);
        //
        
    }
    return [getTokens, tokens]
}

export {useGetTokens};