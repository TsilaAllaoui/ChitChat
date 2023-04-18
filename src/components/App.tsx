import { useState } from 'react'
import Login from './Login'
import '../styles/App.scss'
import UserList from './Conversations'
import Messages from './Messages'
import { BrowserRouter, Route, Routes, Link, useParams, useLocation } from "react-router-dom";

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
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/messages' element={<Messages/>} />
          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
