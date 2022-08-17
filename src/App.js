import React, { useEffect } from "react";
import { Main, Receipts, Error404, Mint } from "./pages";
import { CommonLayout } from "./components"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <CommonLayout>
        <Routes>
          <Route path="/" exact={true} element={<Main />} />
          <Route path="receipts" element={<Receipts />} />
          <Route path="mint" element={<Mint />} />
          <Route path={"*"} element={<Error404 />}/>
        </Routes>
      </CommonLayout> 
    </div>
  );
}

export default App;
