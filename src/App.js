//App.js
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserInfo from './UserInfo';
import Login from './Login';
import Home from './Home';
import { exchangeToken } from './spotifyAuth';
import './Login.css'; // Import styles for the loading screen

function App() {
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const logout = React.useCallback(() => {
    setToken('');
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('token_expiration');
    window.localStorage.removeItem('refresh_token');
    window.localStorage.removeItem('code_verifier');
  }, []);

  useEffect(() => {
    const handleAuth = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      let storedToken = window.localStorage.getItem('token');
      const expirationTime = window.localStorage.getItem('token_expiration');

      // Handle Errors
      if (error) {
        console.error('Spotify Auth Error:', error);
        window.history.pushState({}, null, '/'); // Clear URL
        return;
      }

      // Check Expiration
      if (expirationTime && new Date().getTime() > parseInt(expirationTime)) {
        console.log('Token expired, logging out');
        logout();
        storedToken = null;
      }

      // Handle Exchange Code
      if (!storedToken && code) {
        console.log('Authorization Code found. Exchanging for Token...');
        const codeVerifier = window.localStorage.getItem('code_verifier');
        const CLIENT_ID = (process.env.REACT_APP_CLIENT_ID || '').trim();
        const REDIRECT_URI = (process.env.REACT_APP_REDIRECT_URI || '').trim();

        try {
          const data = await exchangeToken(code, CLIENT_ID, REDIRECT_URI, codeVerifier);

          console.log('Token Exchange Successful');
          const accessToken = data.access_token;
          const refreshToken = data.refresh_token;
          const expiresIn = data.expires_in * 1000;
          const newExpirationTime = new Date().getTime() + expiresIn;

          window.localStorage.setItem('token', accessToken);
          window.localStorage.setItem('token_expiration', newExpirationTime);
          if (refreshToken) {
            window.localStorage.setItem('refresh_token', refreshToken);
          }

          setToken(accessToken);
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
        } catch (err) {
          console.error('Token Exchange Failed:', err);
          // Optional: Show error to user or redirect to login with error param
        }
      } else {
        setToken(storedToken);
      }
      setIsLoading(false);
    };

    handleAuth();
  }, [logout]);

  if (isLoading) {
    return (
      <div className="login-container">
        <div className="login-bg-overlay"></div>
        <div className="bg-orb orb-1"></div>
        <div className="bg-orb orb-2"></div>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '100%', zIndex: 2 }}>
          <h1 className="app-title mb-4" style={{ fontSize: '2rem' }}>Spotistics</h1>
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
          <p className="text-white-50 mt-3 small">Authenticating...</p>
        </div>
      </div>
    );
  }

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
