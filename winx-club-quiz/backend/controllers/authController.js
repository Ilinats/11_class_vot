const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const client = require('../db/db');
const config = require('../config/config');

exports.signup = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await client.query('SELECT * FROM public.users WHERE username = $1', [username]);
      if (result.rows.length > 0) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      const hashedPassword = await argon2.hash(password);
      await client.query('INSERT INTO public.users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
  
      const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({
        message: 'User created successfully',
        token,
        username,
      });
    } catch (error) {
      console.error('Error during signup:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

exports.login = async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const result = await client.query('SELECT * FROM public.users WHERE username = $1', [username]);
      if (result.rows.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      const user = result.rows[0];
  
      const isPasswordValid = await argon2.verify(user.password, password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign(
        { username: user.username },
        config.jwtSecret,
        { expiresIn: '5m' }
      );
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  