import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import Scene from './DotCircle'
import LoginModal from './LoginModal/LoginModal'
import MainPage from './MainPage/MainPage'
import Callback from './Callback'

import './App.css'

function App() {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !accessToken) {  // Only set if there's a token and state is empty
      setAccessToken(token);
    }
  }, []);  

  const handleLogin = (token) => {
    setAccessToken(token);
    localStorage.setItem("accessToken", token); // Store token for persistence
  };

  const handleLogout = () => {
    setAccessToken(null); // Clear state
    localStorage.removeItem("accessToken"); // Remove from local storage
  };

  useEffect(() => {
    console.log("Access Token Changed:", accessToken);
  }, [accessToken]);

  return (
    <Router>
      <Routes>
        <Route path="/callback" element={<Callback setAccessToken={setAccessToken}/>} />
        <Route path="/" element={<MainPage children={
              accessToken ? <Scene /> : <LoginModal setAccessToken={handleLogin}/>
      } onLogout={handleLogout}/>} />
      </Routes>
    </Router>
  )
}

export default App
