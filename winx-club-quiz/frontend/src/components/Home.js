import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { username } = location.state || {};

  const [gender, setGender] = useState(null);

  const handleGenderSelection = (selectedGender) => {
    setGender(selectedGender);
    navigate('/quiz', {
      state: {
        username: username,
        gender: selectedGender,
      },
    });
  };

  if (!username) {
    return <div className="error">Please log in first.</div>;
  }

  return (
    <div className="home-container">
      <h1>Welcome, {username}</h1>
      <h2>What is your gender?</h2>
      <button onClick={() => handleGenderSelection('male')}>Male</button>
      <button onClick={() => handleGenderSelection('female')}>Female</button>
    </div>
  );
};

export default Home;