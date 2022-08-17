import { useState, useEffect, useRef } from "react";
import { Button } from "@mui/material";
import { Connection, clusterApiUrl, Keypair, PublicKey, Transaction, SystemProgram} from "@solana/web3.js";
//import { Metaplex } from "@metaplex-foundation/js";


//import Arweave from 'arweave';
import key from "../images/arweave-keyfile.json"

import * as anchor from "@project-serum/anchor";
//import { Provider, Program, AnchorProvider, web3 } from '@project-serum/anchor'
import { AnchorProvider, Wallet, Program, web3 } from '@project-serum/anchor'
import { MintNft } from "../assets/mint_nft";


function Mint() {
    const [metadata, setMetadata] = useState({
        title: "",
        description: "",
        institution: "",
    })
    
    const handleChange = ( {target: {name, value} }) => {
        setMetadata({...metadata, [name]: value});
    } 

    const [image, setImage] = useState("");
    const [buffers, setBuffer] = useState("");
    let [imageUrl, setImageUrl] = useState("");
    const handleImageUpload = ( e ) => {
        // console.log(e.target.files);
        const {target: {files}} = e;
        const file = files[0];
        setImage(file);
    }

    const handleClick =  () => {
     
    }

    useEffect( () => {
        const arweave = Arweave.init({
            host: 'arweave.net',
            port: 443,
            protocol: 'https',
            timeout: 20000,
            logging: false,
        });

        const tempFn =  async () =>  {
            //let key = JSON.parse(mykey)
            console.log(key)
            console.log('here', buffers)
            
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

        const upLoadMetaJson = async ()  => {
            imageUrl = 'https://arweave.net/EiUon2kumiPHLJkiOJJEkh1zlrUwU4M7sYyYAVOMujc'
            const metadata = {
                name: "Custom DONFT NFT #1",
                symbol: "DONFT",
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
        
                //// deprecated ( may not work  in a future)
                // collection: {
                //     name: "Test Collection",
                //     family: "Custom NFTs",
                //   },
                // creators: [
                //     {
                //       address: "CBBUMHRmbVUck99mTCip5sHP16kzGj3QTYB8K3XxwmQx",
                //       share: 100,
                //     },
                //   ],
              }
        
            const metadataRequest = JSON.stringify(metadata);
            console.log(metadata)
            
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
        
            console.log('json import competed2')
            console.log('Response - make Metadata on arweave : ',  json_response)
        
            let json_uri = metadataTransaction.id ? `https://arweave.net/${metadataTransaction.id}` : undefined;
            console.log('Response - json_uri: ',  json_uri)
            // https://arweave.net/67rpyh54Q17-2zraAnjazQa2QL0Ubo0BxG5xlfFlc-s
        }
      
         
        if (tokenAccounts.value.length == 0){
            if (buffers) {
                
                tempFn();
                upLoadMetaJson()
                //makeNft()
            }
            else {
        
            }
        }

    }, [buffers]);
    
    return (
        <div>
            <div>
                <div>
                    <input type="text" name="title" value={metadata.title} placeholder={metadata.title} onChange={handleChange}/>
                </div>
                <div>
                    <input type="text" name="description" value={metadata.description} placeholder={metadata.description} onChange={handleChange}/>
                </div>
                <div>
                    <input type="text" name="institution" value={metadata.institution} placeholder={metadata.institution} onChange={handleChange}/>
                </div>
                <div>
                    <input type="file" 
                    accept="image/jpg, image/png, image/jpeg, image/gif"
                    name="image" onChange={handleImageUpload}/>
                </div>
                <Button variant="outlined" onClick={handleClick}>Submit</Button>
            </div>
            <div>
                <canvas className="img__box"></canvas>
            </div>
        </div>
    );
}

export {Mint};