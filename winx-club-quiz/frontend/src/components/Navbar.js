import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <nav>
      <ul>
        {token ? (
          <>
            <li>Welcome, user!</li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li><a href="/login">Login</a></li>
            <li><a href="/signup">Signup</a></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;