//Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home({ token, logout }) {
  const navigate = useNavigate();

  // Handle login button click to navigate to /login
  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div className="container mt-4 text-center">
      <h1>Welcome!</h1>
      {!token ? (
        <>
          <p>Please log in to access your account details.</p>
          <button className="btn btn-primary" onClick={handleLoginClick}>Login</button>
        </>
      ) : (
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      )}
    </div>
  );
}

export default Home;
