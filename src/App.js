import AllRoutes from "./components/AllRoutes";
import Nav from "./components/Nav";
import "./styles.css";
import react, { useEffect, useState } from "react";

export default function App() {
  return (
    <div className="App">
      <Nav />
      <AllRoutes />
    </div>
  );
}
