import { useState } from "react";
import ImagesUpload from "../components/ImagesUpload";
import Chat from "../components/Chat";

export default function () {
  const [navToggle, setNavToggle] = useState({
    file: false,
    chat: true
  });
  const handleNavToggle = (active) => {
    if (active === "chat") {
      setNavToggle({
        file: false,
        chat: true
      });
    }
    if (active === "file") {
      setNavToggle({
        file: true,
        chat: false
      });
    }
  };
  return (
    <div>
      <nav className="homeNav">
        <span onClick={() => handleNavToggle("file")}>Image Upload</span>
        <span onClick={() => handleNavToggle("chat")}>Chap App</span>
      </nav>
      <div style={{ marginTop: "20px" }}>
        {navToggle.file && <ImagesUpload />}
        {navToggle.chat && <Chat />}
      </div>
    </div>
  );
}
