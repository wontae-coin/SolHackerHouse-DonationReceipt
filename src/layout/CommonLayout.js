import { Header } from './Header'; 
import { Footer } from './Footer'; 
import { Navigator } from './Navbar'; 

function CommonLayout({children}) {
    return (
        <div className='COMMONLAYOUT'>
            {/* <Header/> */}
            <Navigator/>
                {children}
            {/* <Footer/> */}
        </div>
    );
}

export {CommonLayout};