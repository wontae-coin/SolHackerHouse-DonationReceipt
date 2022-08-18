import React from "react";
import { Main, Receipts, Error404, Mint } from "./pages";
import { CommonLayout } from "./layout";
import { Routes, Route } from "react-router-dom";
// import "../static/css/main.css";
import "./static/css/main.css";
function App() {
  return (
    <div className="App">
      <CommonLayout>
        <Routes>
          <Route path="/" exact={true} element={<Main />} />
          <Route path="mint" element={<Mint />} />
          <Route path={"*"} element={<Error404 />}/>
        </Routes>
      </CommonLayout> 
    </div>
  );
}

export default App;
