import React, {useState} from "react";
import { Button, Input } from "@mui/material";
import { Connection, GetProgramAccountsFilter } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

function Main() {
    let url = "";
    // Hdcogqc4mxkKRrEA7oUqu25bwWgwNeYjGy5BibXuj6Eg
    const [address, setAddress] = useState("");
    const detectAddress = e => {
        const address = e.target.value;
        setAddress(address);
    } 

    const getTokens = () => {
        console.log("working...");
        
    }
  
    return (
        <div>
            <Input onChange={detectAddress} name="address" value={address} placeholder="Put your address"/>
            <Button onClick={getTokens} variant="contained">Search
            </Button>
        </div>
    );
}

export {Main};
