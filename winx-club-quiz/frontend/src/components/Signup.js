import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { signup } from '../services/authService';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await signup(username, password);

      if (data.token) {
        localStorage.setItem('userToken', data.token);

        navigate('/home', {
          state: { username, token: data.token },
        });
      } else {
        setErrorMessage('Failed to create user');
      }
    } catch (error) {
      setErrorMessage('An error occurred during signup');
      console.error('Error signing up:', error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Signup</button>
        </form>
        {errorMessage && <div className="error">{errorMessage}</div>}
        {successMessage && <div className="success">{successMessage}</div>}
      </div>
    </div>
  );
};

export default Signup;