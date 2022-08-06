import { Link } from "react-router-dom";
import { Button } from "@mui/material";
function Navbar() {
    return (
        <div>
            <ul>
                <ul>
                    <Link to="/">
                        <Button variant="outlined" size="small">Go Search</Button>
                    </Link>    
                </ul>
                <ul>
                    <Link to="/mint">
                        <Button variant="outlined" size="small">Go Mint</Button>
                    </Link>    
                </ul>
            </ul>
        </div>
    );
}

export {Navbar};