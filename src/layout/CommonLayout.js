import { Header } from './Header'; 
import { Footer } from './Footer'; 
import { Navigator } from './Navigator'; 

function CommonLayout({children}) {
    return (
        <div>
            <Header/>
            <Navigator/>
                {children}
            <Footer/>
        </div>
    );
}

export {CommonLayout};