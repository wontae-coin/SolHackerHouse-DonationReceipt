import { Header } from './Header'; 
import { Footer } from './Footer'; 
import { Navigator } from './Navbar'; 
import { OrbBackground } from './OrbBackground';
import React, {useEffect, useRef} from "react";

function CommonLayout({children}) {

    return (
        <div className='COMMONLAYOUT'>
            <OrbBackground/>
            {/* <Header/> */}
            <Navigator/>
                {children}
            {/* <Footer/> */}
        </div>
    );
}

export {CommonLayout};