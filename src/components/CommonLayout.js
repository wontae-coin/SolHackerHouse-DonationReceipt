import { Header, Footer, Navigator } from './Layout'; 

function CommonLayout({children}) {
    return (
        <div>
            <Header/>
                {children}
            <Footer/>
        </div>
    );
}

export {CommonLayout};