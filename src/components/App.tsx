import { useState } from 'react'
import Login from './Login'
import '../styles/App.scss'
import UserList from './Conversations'
import Messages from './Messages'

function App() {
  const [count, setCount] = useState(0)

  const id: string = "cKRWwlRPOfPaWdtv58SB";
  const name: string = "Tsila";
  const senderName: string = "Kal";//"Ariane";
  const senderId = "NeLZhBOa04SkiEVcAEPf";//"mwNgONnUJLMSVMF7cn6x";

  return (
    <div className="App">
      <Messages senderName={senderName} senderId={senderId}/>
    </div>
  )
}

export default App
