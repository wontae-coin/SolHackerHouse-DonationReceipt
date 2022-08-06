import { useState } from 'react';
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import * as SPLToken from "@solana/spl-token";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import axios from 'axios';

// axios.defaults.withCredentials = true;

function useGetNftUris(walletPubkey) {
    const [nftUris, setNftUris] = useState([]);
    const connection = new Connection(clusterApiUrl("mainnet-beta"), 'confirmed');

    async function getNftUris() {
        let walletToQuery;
        let tokenAccounts;
        try{
            walletToQuery = new PublicKey(walletPubkey);
            tokenAccounts = await connection.getTokenAccountsByOwner(walletToQuery, { programId: SPLToken.TOKEN_PROGRAM_ID});
        }catch (err){
            console.log(err);
            return;
        }

        let l_nftUris = [];
        console.log('tokenAccounts.value.length', tokenAccounts.value.length);
        console.log('tokenAccounts', tokenAccounts);

        async function getTokensUris(token){
            try{
                let accountInfo = SPLToken.AccountLayout.decode(token.account.data);
                let tokenmetaPubkey = await Metadata.getPDA(accountInfo.mint);
                const tokenmeta = await Metadata.load(connection, tokenmetaPubkey);
                console.log(tokenmeta.data.data.uri);
                let res = await axios.get(tokenmeta.data.data.uri);

                console.log(res.data.properties.files[0].uri);
                if (res.data.properties.files[0].uri){
                    l_nftUris.push(res.data.properties.files[0].uri);
                }
            }catch (err){
                console.log(err);
            }
        }
        // map array, tokenAccounts.value, to promises
        const promises = tokenAccounts.value.map(getTokensUris);
        // wait until all promises are resolved
        await Promise.all(promises);
        
        if (l_nftUris.length == 0){
            l_nftUris.push("https://drive.google.com/uc?export=view&id=18wYCEWnuduEaEC7Bmm6_EZqXqrjbU6fs");
        }
        setNftUris(l_nftUris);
    }
    return [getNftUris, nftUris]
}

export {useGetNftUris};