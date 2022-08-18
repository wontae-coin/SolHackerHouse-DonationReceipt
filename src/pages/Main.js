import React, {useState, useEffect, useRef} from "react";
import { TextField, Grid } from "@mui/material";
import { useGetNftUris } from "../hooks";
import MintSvg from "../static/svg/mint.svg";
import { useWallet } from "@solana/wallet-adapter-react";

function Main() {
    const { publicKey, wallet, disconnect } = useWallet();
    const [ placeholder, setPlaceholder ] = useState("Connect your wallet or input an address");
    // disconnect일때는...?
    
      const [show, setShow] = useState('none');
      const [showMint, setShowMint] = useState('none');
      const [showBack, setShowBack] = useState('none');    
      const [address, setAddress] = useState("");
      
      const [ getNftUris, ntfUris ] = useGetNftUris(address);
      const [currentCard, setCurrentCard] = useState("id_card_current");
      const [nextCard, setNextCard] = useState("id_card_next");
      const [previousCard, setPreviousCard] = useState("id_card_previous");
      
      const [currentInfo, setCurrentInfo] = useState("id_info_current");
      const [nextInfo, setNextInfo] = useState("id_info_next");
      const [previousInfo, setPreviousInfo] = useState("id_info_previous");
      
      useEffect( () => {
        let addr = publicKey === null ? "" : publicKey.toString()
        
        setPlaceholder("Connect your wallet or input an address");
        setAddress(addr)
      }, [publicKey])

    const [count, setCount] = useState(0);
    
    const submit_btn_onClick = () =>{
        // console.log("address:", address);
        if (!address) {
          // let isRightAddress = confirm("Please put an adequate address.");
          alert("Please put your address.")
          return;
          // event.preventDefault;
        };


        getNftUris(address).then(function(res){
          if (res !== false){
            document.getElementById("id_overlay").className = "overlay zoom-in"
            document.getElementById("id_overlay__inner").className = "overlay__inner fade-out"
            document.getElementById("id_card_app").className = "app fade-in"
            document.getElementById("id_back_button").className = "back-button fade-in"
            setShow('');
            setShowBack('');
            setAddress("");
          }else{
            alert("This token does not own any NFTs.");
          }
        });
        // document.getElementById("id_overlay__btn").className = "overlay__btn overlay__btn--transparent disable-object"
        // getTokens();
    }

    const show_mint_btn_onClick = () => {
      document.getElementById("id_overlay").className = "overlay zoom-in"
      document.getElementById("id_overlay__inner").className = "overlay__inner fade-out"
      document.getElementById("id_mint_app").className = "app fade-in"
      document.getElementById("id_back_button").className = "back-button fade-in"
      setShowMint('');
      setShowBack('');
    }

    const onClick_back_button = () => {

      document.getElementById("id_overlay").className = "overlay zoom-out"
      document.getElementById("id_overlay__inner").className = "overlay__inner fade-in"
      document.getElementById("id_card_app").className = "app fade-out"
      document.getElementById("id_back_button").className = "back-button fade-out"
      setShow('none');
      setShowMint('none');
      setShowBack('none');      
    }

    const onClick_btn_slider = (direction) => {
      if(direction === "left"){
        
        document.getElementById("id_card_current").style.zIndex = 100
        document.getElementById("id_card_next").style.zIndex = 50
        document.getElementById("id_card_previous").style.zIndex = 10

        document.getElementById("id_card_current").className = "card previous--card";
        document.getElementById("id_card_next").className = "card current--card";
        document.getElementById("id_card_previous").className = "card next--card";

        document.getElementById("id_info_current").className = "info previous--info"
        document.getElementById("id_info_next").className = "info current--info"
        document.getElementById("id_info_previous").className = "info next--info"

        switch(count%3){
          case 0:
            setCurrentCard("id_card_previous");
            setPreviousCard("id_card_next");
            setNextCard("id_card_current");

            setCurrentInfo("id_info_previous");
            setPreviousInfo("id_info_next");
            setNextInfo("id_info_current");
            break;
          case 1:

            setCurrentCard("id_card_next");
            setPreviousCard("id_card_current");
            setNextCard("id_card_previous");

            setCurrentInfo("id_info_next");
            setPreviousInfo("id_info_current");
            setNextInfo("id_info_previous");

            break;
          case 2:

            setCurrentCard("id_card_current");
            setPreviousCard("id_card_previous");
            setNextCard("id_card_next");

            setCurrentInfo("id_info_current");
            setPreviousInfo("id_info_previous");
            setNextInfo("id_info_next");
            break;
        }
      }
      setCount(count + 1);
    }

    return (
        <div className="MAIN">
            <section className="section main">
            <div className="overlay" id="id_overlay">
              <div className="overlay__inner" id="id_overlay__inner">
                  <h1 className="overlay__title">
                  When we give cheerfully and accept gratefully, 
                  <span className="text-gradient">{"\u00A0"}everyone is blessed</span>.
                  </h1>
                  <h3 className="overlay__speaker">- Maya Angelou -</h3>
                  {/* <p className="overlay__description">
                  <strong>Put your address</strong>
                  </p> */}
                  <div className="overlay__input">
                  <TextField onChange={(val) =>{
                              // console.log(val.target.value);
                              setAddress(val.target.value);
                              }}
                              name="address" 
                              placeholder={placeholder}
                              value={address}
                              variant="outlined"
                              size="small"
                              fullWidth={true}
                              />
                  </div>
                  <div>
                  </div>
                  <div className="overlay__btns">
                  <button id="id_overlay__btn" className="overlay__btn"
                          onClick={submit_btn_onClick}>
                      Search
                  </button>
                  <img className="overlay_btn_mint" 
                       style={{display:showMint}}
                       src={MintSvg} 
                       onClick={show_mint_btn_onClick}
                  />                  
                  </div>
              </div>
            </div>
          </section>
          <section className="section receipt">
            <div className="app" id="id_card_app" style={{display:show}}>
                  <div className="cardList">
                      <button className="cardList__btn btn btn--left" onClick={()=>{onClick_btn_slider('left')}}>
                          <div className="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/>
                          </svg>                            
                          </div>
                      </button>
                      <div className="cards__wrapper">
                          <div id={currentCard} className="card current--card">
                              <div className="card__image">
                                  {/* <img src="https://drive.google.com/uc?export=view&id=1Qsb4WpoRbF6Hjw-IokgE18M81sEI6GUV" alt="" /> */}
                                  <img src={ntfUris[0]?.image} alt="" />
                              </div>
                          </div>
                          <div id={nextCard} className="card next--card">
                              <div className="card__image">
                                  {/* <img src="https://drive.google.com/uc?export=view&id=13ckvorpPQWJQbYNW2-yhxBkCC4_yRbG5" alt="" /> */}
                                  <img src={ntfUris[1]?.image} alt="" />
                              </div>
                          </div>
                          <div id={previousCard} className="card previous--card">
                              <div className="card__image">
                                  {/* <img src="https://drive.google.com/uc?export=view&id=1Tqs07Q4PFOHDPi_tKa55IfsyJllnOJGb" alt="" /> */}
                                  <img src={ntfUris[2]?.image} alt="" />
                              </div>
                          </div> 
                      </div>
                      {/* <button className="cardList__btn btn btn--right" onClick={()=>{onClick_btn_slider('right')}}>
                          <div className="icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                  <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/>
                              </svg>
                          </div>
                      </button> */}
                  </div>

                  

                  <div className="infoList">
                      <div className="info__wrapper">
                          <div id={currentInfo} className="info current--info">
                              <h1 className="text name">{ntfUris[0]?.charity}</h1>
                              <h4 className="text location">{ntfUris[0]?.location}</h4>
                              <h4 className="text date">{ntfUris[0]?.date}</h4>
                              <p className="text description">{ntfUris[0]?.slogan}</p>
                          </div>
                          <div id={nextInfo} className="info next--info">
                          <h1 className="text name">{ntfUris[1]?.charity}</h1>
                              <h4 className="text location">{ntfUris[1]?.location}</h4>
                              <h4 className="text date">{ntfUris[1]?.date}</h4>
                              <p className="text description">{ntfUris[1]?.slogan}</p>
                          </div>
                          <div id={previousInfo} className="info previous--info">
                          <h1 className="text name">{ntfUris[2]?.charity}</h1>
                              <h4 className="text location">{ntfUris[2]?.location}</h4>
                              <h4 className="text date">{ntfUris[2]?.date}</h4>
                              <p className="text description">{ntfUris[2]?.slogan}</p>
                          </div>
                      </div>
                  </div> 
              </div>
              <div className="app" id="id_mint_app" style={{display:showMint}}>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                      <label style={{fontSize:'1rem', marginRight:'20px'}}>Wallet adderss</label>
                      <TextField hiddenLabel
                                    id="input-amount-coin"
                                    // inputRef={withdrawalAmount}
                                    size="small"
                                    // label="Amount"
                                    autoComplete="off" 
                                    onChange = {(event, val) => {
                                                              if (val !== null){
                                                                // action
                                                              };
                                    }}
                                    width='100%'
                                    // sx={{maxWidth: '450px'}}
                                      />
                      </Grid>
                      <Grid item xs={12}>
                        <label style={{fontSize:'1rem',  marginRight:'20px'}}>Wallet adderss</label>
                        <TextField hiddenLabel
                                      id="input-amount-coin"
                                      // inputRef={withdrawalAmount}
                                      size="small"
                                      // label="Amount"
                                      autoComplete="off" 
                                      onChange = {(event, val) => {
                                                                if (val !== null){
                                                                  // action
                                                                };
                                      }}
                                      width='100%'
                                      // sx={{maxWidth: '450px'}}
                                        />
                      </Grid>   
                      <Grid item xs={12}>
                        <button className="overlay__btn overlay__mint_submit_btn overlay__btn--transparent">
                            Mint
                        </button>
                      </Grid>
                    </Grid>
                </div>              
          </section>
          <div id="id_back_button" className="back-button" style={{display:showBack}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" onClick={onClick_back_button}>
                  <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5 15.538l-3.592-3.548 3.546-3.587-1.416-1.403-3.545 3.589-3.588-3.543-1.405 1.405 3.593 3.552-3.547 3.592 1.405 1.405 3.555-3.596 3.591 3.55 1.403-1.416z"/>
                </svg>
          </div>
        </div>
    );
}

export {Main};
