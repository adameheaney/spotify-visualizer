import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Scene from './DotCircle'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
        <Scene />
    </>
  )
}

export default App
