import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RedirectPopupContext } from "../Contexts/RedirectPopupContext";
// import "../Styles/App.scss";
import Login from "./Login";
import { MainPage } from "./MainPage";
import Popup from "./Popup";

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
        <Route path="/home" element={<MainPage />} />
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
