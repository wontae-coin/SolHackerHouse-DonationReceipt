import { useState } from 'react';
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import * as SPLToken from "@solana/spl-token";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import axios from 'axios';

// axios.defaults.withCredentials = true;

function useGetNftUris() {
    const [nftUris, setNftUris] = useState([]);
    const connection_dev = new Connection(clusterApiUrl("devnet"), 'confirmed');
    const connection_main = new Connection(clusterApiUrl("mainnet-beta"), 'confirmed');
    let connection = connection_dev;

    async function getNftUris(walletPubkey) {
        let walletToQuery;
        let tokenAccounts;

        // Searth devnet
        try{
            console.log('trying to search in devnet');
            walletToQuery = new PublicKey(walletPubkey);
            tokenAccounts = await connection.getTokenAccountsByOwner(walletToQuery, { programId: SPLToken.TOKEN_PROGRAM_ID});
        }catch (err){
            // alert("invalid account")
            console.log(err);
            let default_l_nftUris = [];
            setNftUris(default_l_nftUris);
            return false;
        }
        
        // If not found tokenAccounts, then trying to searth in mainnet.
        if (tokenAccounts.value.length === 0){
            
            try{
                console.log('trying to search in mainnet');
                walletToQuery = new PublicKey(walletPubkey);
                tokenAccounts = await connection_main.getTokenAccountsByOwner(walletToQuery, { programId: SPLToken.TOKEN_PROGRAM_ID});
                connection = connection_main;
            } catch (err){
                console.log(err);
                let default_l_nftUris = [];
                setNftUris(default_l_nftUris);
                return false;
            } finally {
                setNftUris([])
            }
            
        }

        if (tokenAccounts.value.length === 0){
            return false;
        }

        let l_nftUris = [];

        async function getTokensUris(token){
            try{
                let accountInfo = SPLToken.AccountLayout.decode(token.account.data);
                let tokenmetaPubkey = await Metadata.getPDA(accountInfo.mint);
                const tokenmeta = await Metadata.load(connection, tokenmetaPubkey);
                let res = await axios.get(tokenmeta.data.data.uri);
                
                let imgdata = res.data;
                if (imgdata.properties && imgdata.properties.files[0].uri){
                    // l_nftUris.push(imgdata.properties.files[0].uri);
                    l_nftUris.push(imgdata);
                } else if (imgdata.image){
                    // l_nftUris.push(imgdata.image);
                    l_nftUris.push(imgdata);
                }
            }catch (err){
                
                return false;
            }
        }
        // map array, tokenAccounts.value, to promises
        const promises = tokenAccounts.value.map(getTokensUris);
        // wait until all promises are resolved
        await Promise.all(promises);
        
        setNftUris(l_nftUris);
    }
    return [getNftUris, nftUris]
}

export {useGetNftUris};