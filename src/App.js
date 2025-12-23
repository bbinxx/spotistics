//App.js
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import UserInfo from './UserInfo';
import Login from './Login';
import Home from './Home';
import { exchangeToken } from './spotifyAuth';

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
        }
      } else {
        setToken(storedToken);
      }
      setIsLoading(false);
    };

    handleAuth();
  }, [logout]);

  if (isLoading) {
    return <div className="text-center mt-5"><div className="spinner-border text-success" role="status"></div></div>;
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
