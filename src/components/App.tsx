import { BrowserRouter, Route, Routes } from "react-router-dom";
import "../Styles/App.scss";
import Login from "./Login";
import { useContext, useEffect } from "react";
import { RedirectPopupContext } from "../Contexts/RedirectPopupContext";
import Popup from "./Popup";
import { MainPage } from "./MainPage";

// Sender and Receiver types
type Receiver = {
  name: string;
  id: string;
};
type Sender = Receiver;

function App() {
  // Hardcoded value for debugging
  const receiverName: string = "Tsila";
  const receiverId: string = "cKRWwlRPOfPaWdtv58SB";
  const senderName: string = "Ariane";
  const senderId = "NeLZhBOa04SkiEVcAEPf";

  const { redirect, setRedirect } = useContext(RedirectPopupContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      {redirect ? (
        <Popup
          content="Login successful... Redirection in progess..."
          hidePopup={() => setRedirect(false)}
        />
      ) : null}
    </BrowserRouter>
  );
}

export default App;
