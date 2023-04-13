import { useState } from 'react'
import Login from './Login'
import '../styles/App.scss'
import UserList from './UserList'

function App() {
  const [count, setCount] = useState(0)

  const id: string = "cKRWwlRPOfPaWdtv58SB";
  const name: string = "Tsila";

  return (
    <div className="App">
      <UserList userId={id} name={name}/>
    </div>
  )
}

export default App
