import { useState } from 'react';
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import * as SPLToken from "@solana/spl-token";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import axios from 'axios';

// axios.defaults.withCredentials = true;

function useGetNftUris(walletPubkey) {
    const [nftUris, setNftUris] = useState([]);

    const walletToQuery = new PublicKey(walletPubkey);
    async function getNftUris() {
        const connection = new Connection(clusterApiUrl("mainnet-beta"), 'confirmed');
        const response = await connection.getTokenAccountsByOwner(walletToQuery, { programId: SPLToken.TOKEN_PROGRAM_ID});

        let l_nftUris = [];
        for (const token of response.value) {
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
        setNftUris(l_nftUris);
    }
    return [getNftUris, nftUris]
}

export {useGetNftUris};