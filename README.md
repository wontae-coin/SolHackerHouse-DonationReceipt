<h1>Initiate the prototype</h1>
1. npm install / yarn add
2. npm run start / yarn start

<h1>Project Description</h1>
1. NFT 조회 (Read)
주소(Pubkey)를 입력하면 해당 Pubkey가 보유한 NFT들을 이미지로서 보여줍니다.
만약 정확한 주소를 입력하지 않았거나 해당 주소가 NFT를 가지고 있지 않은 경우에는 alert popup창을 띄워 경고합니다.

2. NFT 발행(Create), 개발 진행중
NFT 증서 발행하는 페이지(/mint)에서 NFT 메타데이터(기부자 이름, 기부받은 기관, 날짜 등)을 입력을 받으면
@solana/web3.js web3 Javascript API로 NFT를 발행하는 스마트 컨트랙트에 넘겨준다.
그러면 발행주체(인증됨, 서비스 주최자) NFT를 발행하게 됩니다.

NFT를 발행하는 rust 스마트 컨트랙트 프로그램은 개발 완료되었으나 메타데이터를 입력받는 클라이언트 페이지는 아직 개발중에 있습니다.

# Enviroment
RPC URL: https://api.devnet.solana.com
WebSocket URL: wss://api.devnet.solana.com/
Keypair Path : Any Key.json
## Building NFT & Deplyoing NFT Token SmartContract
cd mint-nft
anchor build
anchor deploy
* change declair_id(own ProgramId) mint-nft/program/src/lib.rs
* change mint-nft/Anchor.toml
* ex)
[programs.devnet]
mint_nft = "Program ID"
wallet = "Key path"
[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
## Miniting NFT Token (Local Side)
cd mint-nft
npm install
anchor run test
# ex)
[programs.devnet]
mint_nft = "Program ID"
[provider]
wallet = "Key path"
[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"
## Miniting NFT Token (Client Side)
Upload Image to arweave (Done)
Upload Metadata.json to arweave (Done)
Move Local Mint RPC Code To client (Developing)
