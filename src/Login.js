//Login.js
import React, { useEffect, useState } from 'react';
import { generateCodeVerifier, generateCodeChallenge } from './spotifyAuth';

const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code'; // Changed from 'token' to 'code' for PKCE

function Login() {
  const CLIENT_ID = (process.env.REACT_APP_CLIENT_ID || '').trim();
  const REDIRECT_URI = (process.env.REACT_APP_REDIRECT_URI || '').trim();
  const [loginUrl, setLoginUrl] = useState('');

  useEffect(() => {
    const setupLogin = async () => {
      if (!CLIENT_ID || !REDIRECT_URI) return;

      const verifier = generateCodeVerifier(128);
      const challenge = await generateCodeChallenge(verifier);

      // Store verifier in local storage for the callback
      window.localStorage.setItem('code_verifier', verifier);

      const url = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=${RESPONSE_TYPE}&code_challenge_method=S256&code_challenge=${challenge}&scope=streaming%20user-read-email%20user-read-private%20user-library-read%20user-library-modify%20user-read-playback-state%20user-modify-playback-state`;

      setLoginUrl(url);
      console.log('Generated Login URL (PKCE):', url);
    };

    setupLogin();
  }, [CLIENT_ID, REDIRECT_URI]);

  if (!CLIENT_ID || !REDIRECT_URI) {
    const errorMsg = 'Missing Environment Variables: CLIENT_ID or REDIRECT_URI';
    console.error(errorMsg, { CLIENT_ID, REDIRECT_URI });
    return (
      <div className="container mt-4 text-center">
        <div className="alert alert-danger">
          Configuration Error: {errorMsg}. Check your .env file.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 text-center">
      {loginUrl ? (
        <a
          className="btn btn-primary"
          href={loginUrl}
        >
          Login to Spotify
        </a>
      ) : (
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}

      <div className="mt-3 text-muted small">
        <p>Redirecting to: <code>{REDIRECT_URI}</code></p>
        <div className="alert alert-info d-inline-block text-start">
          <strong>Setup Required (PKCE):</strong>
          <ul className="mb-0">
            <li>Go to your Spotify Developer Dashboard</li>
            <li>Ensure Redirect URI is exactly: <code>{REDIRECT_URI}</code></li>
            <li>Note: This app now uses Authorization Code Flow (PKCE)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Login;
