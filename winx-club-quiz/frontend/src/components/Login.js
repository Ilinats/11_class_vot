import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = () => {
        fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.token) {
            localStorage.setItem('userToken', data.token);

            navigate('/home', {
                state: { username, token: data.token },
            });
            } else {
            setError('Invalid login credentials');
            }
        })
        .catch(err => setError('Error logging in.'));
    };

    return (
        <div className="login-container">
        <div className="login-form">
            <h2>Login</h2>
            <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
                required
            />
            <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            />
            <button onClick={handleLogin}>Login</button>
            {error && <div className="error">{error}</div>}
        </div>
        </div>
    );
    };

export default Login;