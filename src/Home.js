//Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ token, logout }) {
  const navigate = useNavigate();

  // If we have a token, redirect to user info immediately
  React.useEffect(() => {
    if (token) {
      navigate('/user-info');
    }
  }, [token, navigate]);

  // Handle login button click to navigate to /login
  const handleLoginClick = () => {
    navigate('/login');
  };

  if (token) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow-lg p-5 border-0 rounded-4" style={{ maxWidth: '600px', margin: '0 auto', background: 'linear-gradient(145deg, #ffffff, #f0f0f0)' }}>
        <h1 className="display-4 fw-bold mb-4" style={{ color: '#1db954' }}>Spotistics</h1>
        <p className="lead text-secondary mb-5">Analyze your music taste and discover new insights.</p>
        <button
          className="btn btn-lg px-5 py-3 rounded-pill fw-bold text-white"
          style={{ backgroundColor: '#1db954', border: 'none', transition: 'transform 0.2s' }}
          onClick={handleLoginClick}
        >
          Login with Spotify
        </button>
      </div>
    </div>
  );
}

export default Home;
