import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserInfo({ token, logout }) {
  const [user, setUser] = useState(null);

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
      console.error(error);
    });
  }, [token]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.display_name}!</h1>
      <img src={user.images[0].url} alt="Profile" />
      <p>Email: {user.email}</p>
      <button onClick={logout}>Logout</button>
      {/* Add more user info here */}
    </div>
  );
}

export default UserInfo;
