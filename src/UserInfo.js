//UserInfo.js
// UserInfo.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserInfo({ token, logout }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      setUser(response.data);
    })
    .catch(error => {
      if (error.response && error.response.status === 401) {
        setError('Unauthorized. Please log in again.');
        logout(); // Automatically log out if the token is invalid
      } else {
        setError('Failed to fetch user information. Please try again.');
      }
    });
  }, [token]);

  if (error) {
    return (
      <div className="container mt-4 text-center">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="btn btn-danger" onClick={logout}>Logout</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 text-center">
      <h1>Welcome, {user.display_name}!</h1>
      <img 
        src={user.images?.[0]?.url || 'https://via.placeholder.com/150'} 
        alt="Profile" 
        className="rounded-circle"
        width="150"
      />
      <p>Email: {user.email}</p>
      <button className="btn btn-danger mt-3" onClick={logout}>Logout</button>
    </div>
  );
}

export default UserInfo;
