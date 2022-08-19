import { Navigator } from './Navbar'; 
import { OrbBackground } from './OrbBackground';
import React from "react";

function CommonLayout({children}) {

    return (
        <div className='COMMONLAYOUT'>
            <OrbBackground/>
            <Navigator/>
            {children}
        </div>
    );
}

export {CommonLayout};