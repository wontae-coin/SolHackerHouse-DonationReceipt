import React, {useState, useEffect, useRef} from "react";
import { TextField } from "@mui/material";
// import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
// import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import "../static/css/main.css";
import { useGetNftUris } from "../hooks";
import * as PIXI from "https://cdn.skypack.dev/pixi.js";
import { KawaseBlurFilter } from "https://cdn.skypack.dev/@pixi/filter-kawase-blur";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@3.0.0";
import hsl from "https://cdn.skypack.dev/hsl-to-hex";
import debounce from "https://cdn.skypack.dev/debounce";

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
    const ref = useRef(null);
    const [show, setShow] = useState('none');

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
    
    const [address, setAddress] = useState("Hdcogqc4mxkKRrEA7oUqu25bwWgwNeYjGy5BibXuj6Eg");
    const detectAddress = e => {
        const address = e.target.value;
        setAddress(address);
    } 
    const [ getNftUris, ntfUris ] = useGetNftUris(address);
    
    const submit_btn_onClick = () =>{
      document.getElementById("id_overlay").className = "overlay zoom-in"
      document.getElementById("id_overlay__inner").className = "overlay__inner fade-out"
      document.getElementById("id_card_app").className = "app fade-in"
      setShow('');
      // document.getElementById("id_overlay__btn").className = "overlay__btn overlay__btn--transparent disable-object"
      getNftUris();
    }

    useEffect(()=>{

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

      app.start();
  
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
                  <TextField onChange={detectAddress}
                              name="address" 
                              value={address} 
                              placeholder="Put your address" 
                              variant="outlined"
                              size="small"
                              fullWidth={true}
                              color="primary"
                              />
                  </div>
                  <div className="overlay__btns">
                  <button id="id_overlay__btn" className="overlay__btn overlay__btn--transparent"
                          onClick={submit_btn_onClick}>
                      Search
                  </button>
                  </div>
              </div>
            </div>
          </section>
          <section className="section receipt">
            <div className="app" id="id_card_app" style={{display:show}}>
                  <div className="cardList">
                      <button className="cardList__btn btn btn--left">
                          <div className="icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                              <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z"/>
                          </svg>                            
                          </div>
                      </button>
                      <div className="cards__wrapper">
                          <div className="card current--card">
                              <div className="card__image">
                                  <img src="https://drive.google.com/uc?export=view&id=18wYCEWnuduEaEC7Bmm6_EZqXqrjbU6fs" alt="" />
                                  
                              </div>
                          </div>
                          <div className="card next--card">
                              <div className="card__image">
                                  <img src="https://drive.google.com/uc?export=view&id=1Pg4nO297LB_Cw817-m3Bw4xJ_ySixzbj" alt="" />
                                  
                              </div>
                          </div>
                          <div className="card previous--card">
                              <div className="card__image">
                                  <img src="https://drive.google.com/uc?export=view&id=1EJycBpFq6Ix-HsN4yRy97wp-sMmDNmc4" alt="" />
                              </div>
                          </div>
                      </div>
                      <button className="cardList__btn btn btn--right">
                          <div className="icon">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                  <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z"/>
                              </svg>
                          </div>
                      </button>
                  </div>
                  <div className="infoList">
                      <div className="info__wrapper">
                          <div className="info current--info">
                              <h1 className="text name">Unicef</h1>
                              <h4 className="text location">kenya</h4>
                              {/* <p className="text description">The mountains are calling</p> */}
                          </div>
                          <div className="info next--info">
                              <h1 className="text name">World Food Programme</h1>
                              <h4 className="text location">Peru</h4>
                              {/* <p className="text description">Adventure is never far away</p> */}
                          </div>
                          <div className="info previous--info">
                              <h1 className="text name">Chamonix</h1>
                              <h4 className="text location">France</h4>
                              <p className="text description">Let your dreams come true</p>
                          </div>
                      </div>
                  </div>
                  {/* <div className="app__bg">
                      <div className="app__bg__image current--image">
                          <img src="https://source.unsplash.com/Z8dtTatMVMw" alt="" />
                      </div>
                      <div className="app__bg__image next--image">
                          <img src="https://source.unsplash.com/9dmycbFE7mQ" alt="" />
                      </div>
                      <div className="app__bg__image previous--image">
                          <img src="https://source.unsplash.com/m7K4KzL5aQ8" alt="" />
                      </div>
                  </div> */}
              </div>            
          </section>
        </div>
    );
}

export {Main};
