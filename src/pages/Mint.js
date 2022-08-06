import React, {useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { TextField } from "@mui/material";

function Mint() {
    const [ address, setAddress ] = useState("");
    const [ data, setData ] = useState("");

    const detectData = e => {
        setData(e.target.value);
    } 
   

    return (
        <div>
            <TextField onChange={detectData}
            name="data" 
            value={data} 
            placeholder="Your information" 
            variant="outlined"
            size="small"
            fullWidth={true}
            color="primary"
            />
            <Link to={{
                    pathname: `/show`,
                }}>
                <button className="overlay__btn overlay__btn--transparent">
                    Mint
                </button>
            </Link>
        </div>
    );
}

export {Mint};