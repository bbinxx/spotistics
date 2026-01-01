//Login.js
import React, { useEffect, useState } from 'react';
import { generateCodeVerifier, generateCodeChallenge } from './spotifyAuth';
import './Login.css';

const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';

function Login() {
  const CLIENT_ID = (process.env.REACT_APP_CLIENT_ID || '').trim();
  const REDIRECT_URI = (process.env.REACT_APP_REDIRECT_URI || '').trim();
  const [loginUrl, setLoginUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const setupLogin = async () => {
      // Basic validation
      if (!CLIENT_ID || !REDIRECT_URI) {
        setError('Missing configuration. Please check your environment variables.');
        console.error('Missing Env Vars', { CLIENT_ID, REDIRECT_URI });
        return;
      }

      try {
        const verifier = generateCodeVerifier(128);
        const challenge = await generateCodeChallenge(verifier);

        // Store verifier for the callback
        window.localStorage.setItem('code_verifier', verifier);

        const scope = [
          'streaming',
          'user-read-email',
          'user-read-private',
          'user-library-read',
          'user-library-modify',
          'user-read-playback-state',
          'user-modify-playback-state'
        ].join(' ');

        const searchParams = new URLSearchParams({
          client_id: CLIENT_ID,
          response_type: RESPONSE_TYPE,
          redirect_uri: REDIRECT_URI,
          code_challenge_method: 'S256',
          code_challenge: challenge,
          scope: scope
        });

        // URLSearchParams encodes spaces as '+', but Spotify strictly expects space-separated or %20.
        // We can rely on toString() but verify if it works. Standard OAuth allows +.
        // However, to be extra safe and mimic previous behavior:
        setLoginUrl(`${AUTH_ENDPOINT}?${searchParams.toString()}`);

      } catch (err) {
        console.error('Error in login setup:', err);
        setError('Could not initialize login security. Please refresh.');
      }
    };

    setupLogin();
  }, [CLIENT_ID, REDIRECT_URI]);

  return (
    <div className="login-container">
      <div className="login-bg-overlay"></div>
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>

      <div className="login-card">
        <div className="app-brand">
          <h1 className="app-title">Spotistics</h1>
          <p className="app-subtitle">Unlock your music insights</p>
        </div>

        {error ? (
          <div className="error-banner">
            {error}
          </div>
        ) : !loginUrl ? (
          <div className="loading-container">
            <div className="loading-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
          </div>
        ) : (
          <a className="login-btn" href={loginUrl}>
            Login to Spotify
          </a>
        )}
      </div>
    </div>
  );
}

export default Login;
