import { useState, useEffect, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Button } from "@mui/material";
import { Connection } from "@solana/web3.js";
import Arweave from 'arweave';
import key from "../keys/arweave-keyfile.json";
import * as anchor from "@project-serum/anchor";
import { AnchorProvider } from '@project-serum/anchor'
import mintNft from "../instruction/mint_nft.json";
import { TextField } from "@mui/material";

const opts = {
    preflightCommitment: "recent",
};

const programID = new anchor.web3.PublicKey("6cC2tJbg6QGsqu3Zau1Ekgo6RDinpVgnAcHitxobutSP");
const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
    timeout: 20000,
    logging: false,
});

function Mint() {





    const wallet_base = useWallet();
    //console.log('wallet', wallet_base)

    const [metadata, setMetadata] = useState({
        nftTitle: "NFT TITLE",
        nftSymbol: "SYMBOL",
    })
    const handleChange = ( {target: {name, value} }) => {
        console.log(metadata)
        setMetadata({...metadata, [name]: value});
    } 

    const [image, setImage] = useState("");
    const [buffers, setBuffer] = useState("");
    let [imageUrl, setImageUrl] = useState("");
    let [jsonUri, setJsonUri] = useState("");
    let inputRef = useRef();
    const [fileboxName, setFileBoxName] = useState("Select File");

    const handleImageUpload = ( e ) => {
        console.log("e", e);
        const {target: {files}} = e;
        const file = files[0];
        setImage(file);
        let filename = inputRef.current.value;
        setFileBoxName(filename)
    }

    const nftImageRef = useRef();
    const handleClick = async  () => {
        // Here Is Image Uploader Part 
        //console.log(image);
        const reader = new FileReader();

        // console.log('handle clicked')
        reader.addEventListener("load", () => {
            let a = Buffer.from(reader.result, "base64");
            console.log(a);
            setBuffer(a)
            nftImageRef.current.attr("src", reader.result);
            console.log("dasd",nftImageRef.current);
            console.log("dasd",reader.result);

        });
        await reader.readAsDataURL(image)

    }

    useEffect( () => {
        const tempFn =  async () =>  {
            let transaction = await arweave.createTransaction({
                data: buffers
            });
            transaction.addTag('Content-Type', 'image/png'  );
            await arweave.transactions.sign(transaction, key );
            
            //const img_response = await arweave.transactions.post(transaction); 
            let img_response = await arweave.transactions.getUploader(transaction);
            console.log(img_response);
        
            while (!img_response.isComplete) {
                await img_response.uploadChunk();
                console.log(`${img_response.pctComplete}% complete, ${img_response.uploadedChunks}/${img_response.totalChunks}`);
                }
        
            console.log('img competed2')
            
            let imageUrl = transaction.id ? `https://arweave.net/${transaction.id}` : undefined;
            console.log(imageUrl);
            setImageUrl(imageUrl)
        }
        if (buffers) {     
            tempFn();
        }
    }, [buffers]);

    useEffect( () => {
        const upLoadMetaJson = async ()  => {
            //imageUrl = 'https://arweave.net/EiUon2kumiPHLJkiOJJEkh1zlrUwU4M7sYyYAVOMujc'
            const nft_metadata = {
                name: metadata.nftTitle,
                symbol:  metadata.nftSymbol,
                description:
                  "this sis a description TEST for DONFT",
                seller_fee_basis_points: 500,
                external_url: "",
                attributes: [
                    {
                        trait_type: "NFT type",
                        value: "Custom"
                    }
                ],
                properties: {
                  files: [
                    {
                      uri: imageUrl,
                      type: "image/png",
                    },
                  ],
                  category: "image",
                  maxSupply: 0,
        
                },
                image: imageUrl,
              }
              
            
            const metadataRequest = JSON.stringify(nft_metadata);
            console.log(nft_metadata)
            
            const metadataTransaction = await arweave.createTransaction({
                data: metadataRequest
            });
            
            metadataTransaction.addTag('Content-Type', 'application/json');
            
            await arweave.transactions.sign(metadataTransaction, key);
            await arweave.transactions.post(metadataTransaction);    
        
            //let json_response =  await arweave.transactions.post(metadataTransaction);  
            let json_response =  await arweave.transactions.getUploader(metadataTransaction);     
            
            while (!json_response.isComplete) {
                await json_response.uploadChunk();
                console.log(`${json_response.pctComplete}% complete, ${json_response.uploadedChunks}/${json_response.totalChunks}`);
              }
        
            console.log('json import competed')
            //console.log('Response - make Metadata on arweave : ',  json_response)
        
            let json_uri = metadataTransaction.id ? `https://arweave.net/${metadataTransaction.id}` : undefined;
            console.log('Response - json_uri: ',  json_uri)
            setJsonUri(json_uri)

        }
        if (imageUrl) {
            upLoadMetaJson()
        }
    }, [imageUrl]);
    
    useEffect(  () => {
        const makeNft = async ()  => {
            const testNftTitle = metadata.nftTitle;
            const testNftSymbol = metadata.nftSymbol;
            const testNftUri = jsonUri
            //const testNftUri = "https://raw.githubusercontent.com/kyarate/test/main/example.json";

            const wallet = wallet_base
            //console.log("new wallet", wallet);
            
            const network = "https://api.devnet.solana.com"; 
            const connection = new Connection(network, opts.preflightCommitment);
            const provider = new AnchorProvider(
                connection, wallet, opts.preflightCommitment,
            );
            anchor.setProvider(provider);
            //console.log("provider.wallet.publicKey", provider.wallet.publicKey)
            //console.log("wallet.publicKey", wallet.publicKey)
         
            const program = new anchor.Program(mintNft, programID, provider);
            const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
                "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
            );

            // Derive the mint address and the associated token account address
            // Get PDA 
            const mintKeypair = anchor.web3.Keypair.generate();
            const tokenAddress = await anchor.utils.token.associatedAddress({
                mint: mintKeypair.publicKey,
                owner: wallet.publicKey
            });
            //console.log(`New token: ${mintKeypair.publicKey}`);
            console.log(`New token_address:`, tokenAddress);
        
            // Derive the metadata and master edition addresses
            const metadataAddress = ( await anchor.web3.PublicKey.findProgramAddress(
                [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
                ],
                TOKEN_METADATA_PROGRAM_ID
            ))[0];
            //console.log("Metadata initialized");
            console.log("metadataAddress", metadataAddress);
            const masterEditionAddress = (await anchor.web3.PublicKey.findProgramAddress(
                [
                Buffer.from("metadata"),
                TOKEN_METADATA_PROGRAM_ID.toBuffer(),
                mintKeypair.publicKey.toBuffer(),
                Buffer.from("edition"),
                ],
                TOKEN_METADATA_PROGRAM_ID
            ))[0];
            //console.log("Master edition metadata initialized");
            console.log("masterEditionAddress", masterEditionAddress);
            
            await program.methods.mint(
                testNftTitle, testNftSymbol, testNftUri
            )
            .accounts({
                masterEdition: masterEditionAddress,
                metadata: metadataAddress,
                mint: mintKeypair.publicKey,
                tokenAccount: tokenAddress,
                mintAuthority: wallet.publicKey,
                tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
            })
            .signers([mintKeypair])
            .rpc();
            console.log("Minting New NFT is Completed ");
        }
        if (jsonUri) {
            makeNft()
        }
    }, [jsonUri]);

    return (
        <div className="MINT">
            <section className="section main">
                <div className="overlay">
                    <div className="overlay__inner">
                        <h1 className="overlay__title">Metadata input</h1>
                        <div className="overlay__input">
                            <TextField type="text" name="nftTitle" value={metadata.nftTitle} 
                            placeholder={metadata.nftTitle} onChange={handleChange} 
                            size="small" fullWidth={true}/>
                        </div>
                        <div className="overlay__input">
                            <TextField type="text" name="nftSymbol" value={metadata.nftSymbol}
                            placeholder={metadata.nftSymbol} onChange={handleChange}
                            size="small" fullWidth={true}/>
                        </div>
                        <div className="overlay__filebox--container">
                            <div className="overlay__filebox">

                                <input className="upload-name" value={fileboxName} disabled="disabled"/>
                                
                                <input className="overlay__filebox--input" type="file" id="file"
                                accept="image/jpg, image/png, image/jpeg, image/gif"
                                name="image" onChange={handleImageUpload} ref={inputRef}/>
                                <label id="filebox" className="overlay__filebox--label overlay__btn" htmlFor="file">Upload</label>

                            </div>
                            <div className="overlay__btns">
                                <button className="overlay__btn" variant="outlined" onClick={handleClick}>
                                    Submit
                                </button>
                            </div>
                        </div>
                        <div>
                            <img className="img__box"/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export {Mint};