import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LockScreen = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUnlock = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/unlock', { password });
      if (response.data.success) {
        setIsLocked(false);
        navigate('/');
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('Error while authenticating');
    }
  };

  return (
    <>
      {isLocked ? (
        <div className="lock-screen">
          <h1>Screen Locked</h1>
          <form onSubmit={handleUnlock}>
            <label htmlFor="password">Enter Password to Unlock:</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button type="submit">Unlock</button>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      ) : null}
    </>
  );
};

export default LockScreen;