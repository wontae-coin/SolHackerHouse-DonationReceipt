import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";


import fs from "fs";
import Arweave from 'arweave';

// 1. 이미지 업로드 -> src 폴더 -> src에 있을거고, 얘가 arweave 들어가면 그떄 uri로 변해서, 
// image를 arweave에 올리면 이미지 url이 나오고, uri를... 
// 2/. 메타데이터 uri
// 3. nft 발행

function Mint() {
    const [metadata, setMetadata] = useState({
        title: "",
        description: "",
        institution: "",
        image: ""
    })
    
    const handleChange = ( {target: {name, value} }) => {
        setMetadata({...metadata, [name]: value});
    } 
    
    //* useEffect component update 할 때
    let wallet; 
    wallet = new Keypair.generate(); 
    let program;
    
    //* 사용자가 이미지 입력?
    useEffect( () => {
        //* componentDidMount
        let connection = new Connection(clusterApiUrl("devnet"));
        let metaplex = new Metaplex(connection);
        let arweave = Arweave.init({});
        
        //* componentUnmount 초기화
        return () => {
            connection = "";
            metaplex = "";
            arweave = "";
            
            setMetadata({
                title: "",
                description: "",
                institution: "",
                image: ""
            })
        }
    })
        
        
        const handleClick =  () => {
            const {title: nftTitle, description: nftDescription, institution: nftInstitution, image: nftImage} = metadata;
        }
            const uploadImage = async (image) => {
                
                const arweave = Arweave.init({
                    host: 'arweave.net',
                    port: 443,
                    protocol: 'https',
                    timeout: 20000,
                    logging: false,
                });
                
                const key = JSON.parse(fs.readFileSync("./arweave-keyfile.json", "utf-8"))
                console.log(key)
                
                let data = fs.readFileSync('./ape-punk.png');    

                const imageTransaction = await arweave.createTransaction({
                    data: data,
                });
                imageTransaction.addTag("Content-Type", "image/png");

                
                await arweave.transactions.sign(imageTransaction, wallet);
                let img_response = await arweave.transactions.getUploader(imageTransaction);

                while (!img_response.isComplete) {
                    await img_response.uploadChunk();
                    console.log(`${img_response.pctComplete}% complete, ${img_response.uploadedChunks}/${img_response.totalChunks}`);
                }
                console.log('image upload completed', img_response);

                let imageUrl = imageTransaction.id ? `https://arweave.net/${imageTransaction.id}` : undefined;
                console.log(imageUrl);

                return imageUrl;
            }
            
            // const uploadMetadata = async (metadata) => {
            //     const metadataTransaction = await arweave.createTransaction({
            //         data: JSON.stringify(metadata)
            //     })
            //     metadataTransaction.addTag("Content-Type", "application/json");
            //     await arweave.transactions.sign(metadataTransaction, wallet);
            //     const response = await arweave.transactions.post(metadataTransaction);
            //     return response;
            // }
    
            // const imageResponse = await uploadImage(image);
            // const metadataResponse = await uploadMetadata(metadata);
            
            //* test-nft.js
            // const mintNFTResponse = metaplex.nfts().create({
            //     uri: "https://ffaaqinzhkt4ukhbohixfliubnvpjgyedi3f2iccrq4efh3s.arweave.net/KUAIIbk6p8oo4XHRcq0U__C2r0mwQaNl0gQow4Qp9yk",
            //     maxSupply: 1,
            // });

    return (
        <div>
            <div>
                <input name="title" value={metadata.title} placeholder={metadata.title} onChange={handleChange}/>
            
            </div>
            <div>
                <input name="description" value={metadata.description} placeholder={metadata.description} onChange={handleChange}/>
            </div>
            <div>
                <input name="institution" value={metadata.institution} placeholder={metadata.institution} onChange={handleChange}/>
            </div>
            <div>
                <input name="image" value={metadata.image} placeholder={metadata.image} onChange={handleChange}/>
            </div>
            <Button variant="outlined" onClick={handleClick}>Submit</Button>
        </div>
    );
}

export {Mint};