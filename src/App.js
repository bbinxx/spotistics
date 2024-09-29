//App.js
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserInfo from './UserInfo';
import Login from './Login';
import Home from './Home';

function App() {
  const [token, setToken] = useState('');
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');
    const expirationTime = window.localStorage.getItem('token_expiration');
    
    if (expirationTime && new Date().getTime() > expirationTime) {
      setIsTokenExpired(true);
      logout();
    } else if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
      const expiresIn = 3600 * 1000; // 1 hour
      const expirationTime = new Date().getTime() + expiresIn;
      
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('token_expiration', expirationTime);
      setIsTokenExpired(false);
    }
    
    setToken(token);
    window.location.hash = ''; // Clean up the URL
  }, []);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('token_expiration');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home token={token} logout={logout} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-info" element={token ? <UserInfo token={token} logout={logout} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
