import { useState } from 'react'
import Login from './Login'
import '../styles/App.scss'
import UserList from './Conversations'
import Messages from './Messages'

function App() {
  const [count, setCount] = useState(0)

  const receiverName: string = "Tsila";
  const receiverId: string = "cKRWwlRPOfPaWdtv58SB";
  const senderName: string = "Ariane";
  const senderId = "NeLZhBOa04SkiEVcAEPf";

  return (
    <div className="App">
      <Messages senderName={senderName} senderId={senderId} receiverId={receiverId}/>
    </div>
  )
}

export default App
