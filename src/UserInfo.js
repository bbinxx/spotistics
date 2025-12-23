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
        console.log('User Data Fetched:', response.data);
        setUser(response.data);
      })
      .catch(error => {
        console.error('Error fetching user info:', error);
        if (error.response) {
          console.error('Error Response Data:', error.response.data);
          console.error('Error Status:', error.response.status);
          console.error('Error Headers:', error.response.headers);

          if (error.response.status === 401) {
            setError('Unauthorized: Token expired or invalid. Please log in again.');
            logout();
          } else {
            setError(`API Error (${error.response.status}): ${error.response.data.error?.message || error.message}`);
          }
        } else if (error.request) {
          console.error('No response received:', error.request);
          setError('Network Error: No response received from Spotify API.');
        } else {
          console.error('Error setting up request:', error.message);
          setError(`Application Error: ${error.message}`);
        }
      });
  }, [token, logout]);

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
    <div className="container mt-5">
      <div className="card shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-header border-0 p-4 text-white" style={{ background: 'linear-gradient(90deg, #1db954 0%, #191414 100%)' }}>
          <h2 className="m-0 fw-bold">User Profile</h2>
        </div>
        <div className="card-body p-5">
          <div className="row align-items-center">
            <div className="col-md-4 text-center mb-4 mb-md-0">
              <div className="position-relative d-inline-block">
                <img
                  src={user.images?.[0]?.url || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="rounded-circle shadow-sm"
                  width="180"
                  height="180"
                  style={{ objectFit: 'cover', border: '5px solid white' }}
                />
                <span className="position-absolute bottom-0 end-0 badge rounded-pill bg-success border border-white p-2">
                  {user.product === 'premium' ? 'Premium' : 'Free'}
                </span>
              </div>
            </div>
            <div className="col-md-8">
              <h1 className="display-5 fw-bold mb-1">{user.display_name}</h1>
              <p className="text-muted mb-4 fs-5">{user.email}</p>

              <div className="row g-3 mb-4">
                <div className="col-auto">
                  <div className="p-3 bg-light rounded-3 text-center min-w-100">
                    <div className="fw-bold fs-4 text-dark">{user.followers?.total || 0}</div>
                    <div className="small text-secondary text-uppercase">Followers</div>
                  </div>
                </div>
                <div className="col-auto">
                  <div className="p-3 bg-light rounded-3 text-center min-w-100">
                    <div className="fw-bold fs-4 text-dark">{user.country || 'N/A'}</div>
                    <div className="small text-secondary text-uppercase">Country</div>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2">
                <a href={user.external_urls?.spotify} target="_blank" rel="noopener noreferrer" className="btn btn-dark rounded-pill px-4">
                  Open in Spotify
                </a>
                <button className="btn btn-outline-danger rounded-pill px-4" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserInfo;
