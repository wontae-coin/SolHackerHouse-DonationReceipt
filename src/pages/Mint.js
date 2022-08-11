import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";
import { Metaplex } from "@metaplex-foundation/js";
import Arweave from 'arweave';
import axios from "axios";


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

    const [image, setImage] = useState({
        file: "",
        previewURL: ""
    });

    const handleImageUpload = ( {target: {files}}) => {
        const file = files[0];
        setImage({...image, [file]: file});
    }

    const Preview = () => {
        // if (!files) return false;
        const imgEl = document.querySelector(".img__box") 
        const reader = new FileReader();

        reader.onload = () => (
            imgEl.style.backgroundImage = `url(${reader.result})`
        )
        // reader.readAsDataURL(file);
    }

    const handleClick =  () => {
        //* IMAGE
        const nftImageURL = "/mint/image";
        const formData = new FormData();
        formData.append("image", image);
        const config = {
            Headers: {
                "content-type": "multipart/form-data"
            }
        }

        axios.post(nftImageURL, formData).then( res => {
            console.log(res);
        })


        //* METADATA
        const {title: nftTitle, description: nftDescription, institution: nftInstitution, image: nftImage} = metadata;
    }




        // const uploadImage = async (image) => {
        //     const imageTransaction = await arweave.createTransaction({
        //         data: image,
        //     });
        //     imageTransaction.addTag("Content-Type", "image/png");
        //     await arweave.transactions.sign(imageTransaction, wallet);
        //     const response = await arweave.transactions.post(imageTransaction);
        //     return response;
        // }
        
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

    //* useEffect component update 할 때
    let wallet; 
    wallet = Keypair.generate(); 
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
    }, []);

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
                <div className="img__box"></div>
            </div>
        </div>
    );
}

export {Mint};