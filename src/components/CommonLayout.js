import { Header, Footer, Navigator } from './Layout'; 

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