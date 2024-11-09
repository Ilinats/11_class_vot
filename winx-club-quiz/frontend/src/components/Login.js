import React, { useState } from 'react';
import { login } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [token, setToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await login(username, password);
      console.log('Login response:', data);

      if (data && data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        console.log('Login successful:', data.token);
        navigate('/home');
      } else if (data.message) {
        setErrorMessage(data.message);
      } else {
        setErrorMessage('Unexpected response from server');
        console.log('Token not found in response');
      }
    } catch (error) {
      setErrorMessage('An error occurred during login');
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;