import { Header } from './Header'; 
import { Footer } from './Footer'; 
import { Navbar } from './Navbar'; 

function CommonLayout({children}) {
    return (
        <div>
            <Header/>
            <Navbar/>
                {children}
            <Footer/>
        </div>
    );
}

export {CommonLayout};