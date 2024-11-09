import React, { useState } from 'react';
import { signup } from '../services/authService'; // Import the signup function

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await signup(username, password);

      if (data.message) {
        setErrorMessage(data.message);
      } else {
        setSuccessMessage('User created successfully');
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      setErrorMessage('An error occurred during signup');
      console.error('Error signing up:', error);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
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
        <button type="submit">Signup</button>
      </form>
      {errorMessage && <p>{errorMessage}</p>}
      {successMessage && <p>{successMessage}</p>}
    </div>
  );
};

export default Signup;