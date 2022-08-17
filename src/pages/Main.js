import React, {useState, useEffect, useRef} from "react";
import { TextField, Grid } from "@mui/material";
// import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
// import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import "../static/css/main.css";
import { useGetNftUris } from "../hooks";
import * as PIXI from "https://cdn.skypack.dev/pixi.js";
import { KawaseBlurFilter } from "https://cdn.skypack.dev/@pixi/filter-kawase-blur";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@3.0.0";
import hsl from "https://cdn.skypack.dev/hsl-to-hex";
import debounce from "https://cdn.skypack.dev/debounce";
import MintSvg from "../static/svg/mint.svg";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

// return a random number within a range
function random(min, max) {
  return Math.random() * (max - min) + min;
}

// map a number from 1 range to another
function map(n, start1, end1, start2, end2) {
  return ((n - start1) / (end1 - start1)) * (end2 - start2) + start2;
}

// Create a new simplex noise instance
const simplex = new SimplexNoise();

// ColorPalette className
class ColorPalette {
  constructor() {
    this.setColors();
    this.setCustomProperties();
  }

  setColors() {
    // pick a random hue somewhere between 220 and 360
    this.hue = ~~random(220, 360);
    this.complimentaryHue1 = this.hue + 30;
    this.complimentaryHue2 = this.hue + 60;
    // define a fixed saturation and lightness
    this.saturation = 95;
    this.lightness = 50;

    // define a base color
    this.baseColor = hsl(this.hue, this.saturation, this.lightness);
    // define a complimentary color, 30 degress away from the base
    this.complimentaryColor1 = hsl(
      this.complimentaryHue1,
      this.saturation,
      this.lightness
    );
    // define a second complimentary color, 60 degrees away from the base
    this.complimentaryColor2 = hsl(
      this.complimentaryHue2,
      this.saturation,
      this.lightness
    );

    // store the color choices in an array so that a random one can be picked later
    this.colorChoices = [
      this.baseColor,
      this.complimentaryColor1,
      this.complimentaryColor2
    ];
  }

  randomColor() {
    // pick a random color
    return this.colorChoices[~~random(0, this.colorChoices.length)].replace(
      "#",
      "0x"
    );
  }

  setCustomProperties() {
    // set CSS custom properties so that the colors defined here can be used throughout the UI
    document.documentElement.style.setProperty("--hue", this.hue);
    document.documentElement.style.setProperty(
      "--hue-complimentary1",
      this.complimentaryHue1
    );
    document.documentElement.style.setProperty(
      "--hue-complimentary2",
      this.complimentaryHue2
    );
  }
}

// Orb className
class Orb {
  // Pixi takes hex colors as hexidecimal literals (0x rather than a string with '#')
  constructor(fill = 0x000000) {
    // bounds = the area an orb is "allowed" to move within
    this.bounds = this.setBounds();
    // initialise the orb's { x, y } values to a random point within it's bounds
    this.x = random(this.bounds["x"].min, this.bounds["x"].max);
    this.y = random(this.bounds["y"].min, this.bounds["y"].max);

    // how large the orb is vs it's original radius (this will modulate over time)
    this.scale = 1;

    // what color is the orb?
    this.fill = fill;

    // the original radius of the orb, set relative to window height
    this.radius = random(window.innerHeight / 6, window.innerHeight / 3);

    // starting points in "time" for the noise/self similar random values
    this.xOff = random(0, 1000);
    this.yOff = random(0, 1000);
    // how quickly the noise/self similar random values step through time
    this.inc = 0.002;

    // PIXI.Graphics is used to draw 2d primitives (in this case a circle) to the canvas
    this.graphics = new PIXI.Graphics();
    this.graphics.alpha = 0.825;

    // 250ms after the last window resize event, recalculate orb positions.
    window.addEventListener(
      "resize",
      debounce(() => {
        this.bounds = this.setBounds();
      }, 250)
    );
  }

  setBounds() {
    // how far from the { x, y } origin can each orb move
    const maxDist =
      window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;
    // the { x, y } origin for each orb (the bottom right of the screen)
    const originX = window.innerWidth / 1.25;
    const originY =
      window.innerWidth < 1000
        ? window.innerHeight
        : window.innerHeight / 1.375;

    // allow each orb to move x distance away from it's x / y origin
    return {
      x: {
        min: originX - maxDist,
        max: originX + maxDist
      },
      y: {
        min: originY - maxDist,
        max: originY + maxDist
      }
    };
  }

  update() {
    // self similar "psuedo-random" or noise values at a given point in "time"
    const xNoise = simplex.noise2D(this.xOff, this.xOff);
    const yNoise = simplex.noise2D(this.yOff, this.yOff);
    const scaleNoise = simplex.noise2D(this.xOff, this.yOff);

    // map the xNoise/yNoise values (between -1 and 1) to a point within the orb's bounds
    this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
    this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);
    // map scaleNoise (between -1 and 1) to a scale value somewhere between half of the orb's original size, and 100% of it's original size
    this.scale = map(scaleNoise, -1, 1, 0.5, 1);

    // step through "time"
    this.xOff += this.inc;
    this.yOff += this.inc;
  }

  render() {
    // update the PIXI.Graphics position and scale values
    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.scale.set(this.scale);

    // clear anything currently drawn to graphics
    this.graphics.clear();

    // tell graphics to fill any shapes drawn after this with the orb's fill color
    this.graphics.beginFill(this.fill);
    // draw a circle at { 0, 0 } with it's size set by this.radius
    this.graphics.drawCircle(0, 0, this.radius);
    // let graphics know we won't be filling in any more shapes
    this.graphics.endFill();
  }
};

function Main() {
    const { publicKey, wallet, disconnect } = useWallet();
    const [ placeholder, setPlaceholder ] = useState("Connect your wallet or input an address");
    // disconnect일때는...?
    
    
    
    // useEffect( () => {
      //   console.log("akwlakr:", publicKey)
      // });
      const ref = useRef(null);
      
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
        
        console.log("address:",address, "publicKey:", publicKey);
        if (address == publicKey) console.log("같")
        else console.log("다")
  
        console.log('이거도 들어와야하는거아닌가?', publicKey);
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

    useEffect(()=>{

      // Create PixiJS app
      const app = new PIXI.Application({
        // render to <canvas className="orb-canvas"></canvas>
        // view: document.querySelector(".orb-canvas"),
        // auto adjust size to fit the current window
        resizeTo: window,
        // transparent background, we will be creating a gradient background later using CSS
        transparent: true
      });
    
      // Create colour palette
      const colorPalette = new ColorPalette();
      app.stage.filters = [new KawaseBlurFilter(30, 10, true)];
      // Create orbs
      const orbs = [];

      for (let i = 0; i < 10; i++) {
          const orb = new Orb(colorPalette.randomColor());
          app.stage.addChild(orb.graphics);
          orbs.push(orb);
      }

      ref.current.appendChild(app.view);
      
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          app.ticker.add(() => {
            orbs.forEach((orb) => {
              orb.update();
              orb.render();
            });
          });
      } else {
          orbs.forEach((orb) => {
            orb.update();
            orb.render();
          });
      }

      // document.querySelector(".overlay__btn--colors")
      //         .addEventListener("click", () => {
      //                             colorPalette.setColors();
      //                             colorPalette.setCustomProperties();
      //                             orbs.forEach((orb) => {
      //                                 orb.fill = colorPalette.randomColor();
      //                             });
      //                     });
  }, []);

    return (
        <div>
            <div className="button-container">
              <WalletMultiButton/>
            </div>
            <section className="section main">
            <div ref={ref} className="orb-canvas container"/>
            <div className="overlay" id="id_overlay">
              <div className="overlay__inner" id="id_overlay__inner">
                  <h1 className="overlay__title">
                  When we give cheerfully and accept gratefully, 
                  <span className="text-gradient">everyone is blessed</span>.
                  </h1>
                  <h3 className="overlay__speaker">- Maya Angelou -</h3>
                  <p className="overlay__description">
                  {/* <strong>Put your address</strong> */}
                  </p>
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
                              color="primary"
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
