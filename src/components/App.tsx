import { BrowserRouter, Route, Routes, Link, useParams, useLocation } from "react-router-dom";
import Conversations from "./ConversationsBackup";
import Messages from './Messages'
import SignUp from "./SignUp";
import Login from './Login'
import '../styles/App.scss'
import Main from "./Main";

// Sender and Receiver types
type Receiver = {
  name: string,
  id: string
};
type Sender = Receiver;


function App() {

  // Hardcoded value for debugging
  const receiverName: string = "Tsila";
  const receiverId: string = "cKRWwlRPOfPaWdtv58SB";
  const senderName: string = "Ariane";
  const senderId = "NeLZhBOa04SkiEVcAEPf";

  return (
    <div>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Main />} />
            <Route path='/main' element={<Main/>} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<SignUp />} />
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
