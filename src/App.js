import React from "react";
import { Main, Receipts, Mint, Show, Error404 } from "./pages";
import { CommonLayout } from "./Layout"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <CommonLayout>
        <Routes>
          <Route path="/" exact={true} element={<Main />} />
          <Route path="receipts/:address" element={<Receipts />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="/show/:nftaddress" element={<Show />} />
          <Route path={"*"} element={<Error404 />}/>
        </Routes>
      </CommonLayout> 
    </div>
  );
}

export default App;
