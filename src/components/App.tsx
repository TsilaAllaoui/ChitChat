import { BrowserRouter, Route, Routes, Link, useParams, useLocation } from "react-router-dom";
import Messages from './Messages'
import Login from './Login'
import '../styles/App.scss'
import SignUp from "./SignUp";
import Conversations from "./Conversations";

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
            <Route path='/' element={<SignUp />} />
            <Route path='/signup' element={<SignUp />} />
            <Route path='/login' element={<Login />} />
            <Route path='/messages' element={<Messages/>} />
            <Route path='/conversations' element={<Conversations name="" userId=""/>} />
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
