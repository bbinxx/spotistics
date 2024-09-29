import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserInfo from './UserInfo';
import Login from './Login';
import Home from './Home';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];

      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/user-info" element={token ? <UserInfo token={token} logout={logout} /> : <Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
