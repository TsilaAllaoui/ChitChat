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

<<<<<<< HEAD
  // Hardcoded value for debugging
=======
>>>>>>> d3ecfed078efe0c6ea9cd1d51aebd9503716d609
  const receiverName: string = "Tsila";
  const receiverId: string = "cKRWwlRPOfPaWdtv58SB";
  const senderName: string = "Ariane";
  const senderId = "NeLZhBOa04SkiEVcAEPf";

  return (
<<<<<<< HEAD
    <div>
      <BrowserRouter>
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/messages' element={<Messages/>} />
          </Routes>
      </BrowserRouter>
=======
    <div className="App">
      <Messages senderName={senderName} senderId={senderId} receiverId={receiverId}/>
>>>>>>> d3ecfed078efe0c6ea9cd1d51aebd9503716d609
    </div>
  )
}

export default App
