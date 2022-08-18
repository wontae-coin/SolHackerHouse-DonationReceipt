import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
function Navigator() {
    const [destination, setDestination] = useState("/mint");
    const location = useLocation();
    useEffect( ()=> {
        let main = "/";
        let mint = "/mint";
        setDestination(location.pathname === main ? mint : main)
    }, [location.pathname]);
    return (
        <div>
            <Link to={destination}>
                <button className="navigator_btn">
                    {destination === "/" ? "main" : destination.substring(1, destination.length)}
                </button>
            </Link>
        </div>
    );
}

export {Navigator};