import { useState } from 'react';
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import * as SPLToken from "@solana/spl-token";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import axios from 'axios';

// axios.defaults.withCredentials = true;

function useGetNftUris(walletPubkey) {
    const [nftUris, setNftUris] = useState([]);
    const connection_dev = new Connection(clusterApiUrl("devnet"), 'confirmed');
    const connection_main = new Connection(clusterApiUrl("mainnet-beta"), 'confirmed');
    let connection = connection_dev;

    async function getNftUris() {
        let walletToQuery;
        let tokenAccounts;

        // Searth devnet
        try{
            console.log('trying to searth in devnet');
            walletToQuery = new PublicKey(walletPubkey);
            tokenAccounts = await connection.getTokenAccountsByOwner(walletToQuery, { programId: SPLToken.TOKEN_PROGRAM_ID});
        }catch (err){
            console.log(err);
            let default_l_nftUris = [];
            default_l_nftUris.push("https://drive.google.com/uc?export=view&id=1Qsb4WpoRbF6Hjw-IokgE18M81sEI6GUV");
            default_l_nftUris.push("https://drive.google.com/uc?export=view&id=13ckvorpPQWJQbYNW2-yhxBkCC4_yRbG5");
            default_l_nftUris.push("https://drive.google.com/uc?export=view&id=1Tqs07Q4PFOHDPi_tKa55IfsyJllnOJGb");
            setNftUris(default_l_nftUris);
            return false;
        }
        
        // If not found tokenAccounts, then trying to searth in mainnet.
        if (tokenAccounts.value.length == 0){
            try{
                console.log('trying to searth in mainnet');
                walletToQuery = new PublicKey(walletPubkey);
                tokenAccounts = await connection_main.getTokenAccountsByOwner(walletToQuery, { programId: SPLToken.TOKEN_PROGRAM_ID});
                connection = connection_main;
            }catch (err){
                console.log(err);
                let default_l_nftUris = [];
                default_l_nftUris.push("https://drive.google.com/uc?export=view&id=1Qsb4WpoRbF6Hjw-IokgE18M81sEI6GUV");
                default_l_nftUris.push("https://drive.google.com/uc?export=view&id=13ckvorpPQWJQbYNW2-yhxBkCC4_yRbG5");
                default_l_nftUris.push("https://drive.google.com/uc?export=view&id=1Tqs07Q4PFOHDPi_tKa55IfsyJllnOJGb");
                setNftUris(default_l_nftUris);
                return false;
            }
        }

        let l_nftUris = [];
        console.log('tokenAccounts.value.length', tokenAccounts.value.length);
        console.log('tokenAccounts', tokenAccounts);

        async function getTokensUris(token){
            try{
                let accountInfo = SPLToken.AccountLayout.decode(token.account.data);
                let tokenmetaPubkey = await Metadata.getPDA(accountInfo.mint);
                const tokenmeta = await Metadata.load(connection, tokenmetaPubkey);
                console.log('meta uri',tokenmeta.data.data.uri);
                let res = await axios.get(tokenmeta.data.data.uri);

                let imgdata = res.data;
                if (imgdata.properties && imgdata.properties.files[0].uri){
                    l_nftUris.push(imgdata.properties.files[0].uri);
                } else if (imgdata.image){
                    l_nftUris.push(imgdata.image);
                }
            }catch (err){
                console.log(err);
            }
        }
        // map array, tokenAccounts.value, to promises
        const promises = tokenAccounts.value.map(getTokensUris);
        // wait until all promises are resolved
        await Promise.all(promises);

        console.log('l_nftUris', l_nftUris);

        // Just add default URI to l_nftUris's tail.
        l_nftUris.push("https://drive.google.com/uc?export=view&id=1Qsb4WpoRbF6Hjw-IokgE18M81sEI6GUV");
        l_nftUris.push("https://drive.google.com/uc?export=view&id=13ckvorpPQWJQbYNW2-yhxBkCC4_yRbG5");
        l_nftUris.push("https://drive.google.com/uc?export=view&id=1Tqs07Q4PFOHDPi_tKa55IfsyJllnOJGb");
        setNftUris(l_nftUris);
    }
    return [getNftUris, nftUris]
}

export {useGetNftUris};