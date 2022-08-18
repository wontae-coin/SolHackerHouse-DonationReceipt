import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function Navigator() {
    const [destination, setDestination] = useState("/mint");
    const location = useLocation();
    useEffect( ()=> {
        let main = "/";
        let mint = "/mint";
        setDestination(location.pathname === main ? mint : main)
    }, [location.pathname]);
    return (
        <div className="NAVBAR">
            <div className="nav-button-container">
                <Link to={destination}>
                    <Button variant="outlined" style={{color: "#512da8", borderColor: "#512da8", height: "48px", fontSize: "16px"}}>
                        {destination === "/" ? "main" : destination.substring(1, destination.length)}
                    </Button>
                </Link>
            </div>
            <div className="wallet-button-container">
              <WalletMultiButton style={{padding: "5px 15px", borderColor: "#512da8"}}/>
            </div>
        </div>
    );
}

export {Navigator};