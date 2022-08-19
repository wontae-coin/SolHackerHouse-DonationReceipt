## Default branch
CleanCode, where this project has to be initiated

## Project Description
1. NFT Inquiry
When the address is received, the service show the images of the NFTs held by that address.
If the correct address is not entered or the address does not have an NFT, the alert popup window is displayed to warn you.
- test wallet address <br>
Fq2PLUzruav37hmZSA7VSt1Er7PD9vV65gyk6MYqgSVV


2. NFT issue(in progress)
When the metadata of the NFT(donor name, donor organization, date, etc.) is received on the client side, through the steps as following:  
    1. Upload the image to Arweave
    2. Upload the json file that contains the metadata to Arweave
    3. Mint NFT with the Image and metadata

The smart contract program that publishes NFT has been developed, but the client minting page that NFT transfer system is developing 

## Project Installation
1. npm install / yarn add <br/>
2. npm run start / yarn start

## On-chain Enviroment
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/
Keypair Path : Any Key.json

## Building NFT & Deplyoing NFT Token SmartContract
cd mint-nft
anchor build
anchor deploy
* change declair_id(own ProgramId) mint-nft/program/src/lib.rs
* change mint-nft/Anchor.toml
* ex) <br/>
[programs.devnet] <br/>
mint_nft = "Program ID" <br/>
wallet = "Key path" <br/>
[scripts] <br/>
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"



## Miniting NFT Token (Client Side)
<on the / page>  <br/>
connect wallet using phantom and set Devnet network  <br/>
<on the /mint page>  <br/>
put NFT Title, NFT Symbol, Image,  <br/>
then summit   <br/>

Upload Image to arweave (Done) <br/>
Upload Metadata.json to arweave (Done) <br/>
Mint NFT Token on connected wallet <br/>


## Miniting NFT Token (Local Side)
cd mint-nft <br/>
npm install <br/>
set metadata uri on tests/mint-nft.ts  <br/>
anchor run test  <br/>

# ex)
[programs.devnet] <br/>
mint_nft = "Program ID" <br/>
[provider] <br/>
wallet = "Key path"

