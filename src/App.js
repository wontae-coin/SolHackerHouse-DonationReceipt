import React from "react";
import { Main, Receipts } from "./pages";
import { CommonLayout } from "./components"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <CommonLayout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="receipts" element={<Receipts />} />
        </Routes>
      </CommonLayout> 
    </div>
  );
}

export default App;
