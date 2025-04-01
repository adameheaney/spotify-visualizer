import { useState } from 'react'

import Scene from './DotCircle'
import LoginModal from './LoginModal/LoginModal'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LoginModal />
      <Scene />
    </>
  )
}

export default App
