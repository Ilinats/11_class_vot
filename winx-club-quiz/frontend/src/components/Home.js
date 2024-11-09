import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleQuizChoice = (gender) => {
    if (gender === 'male') {
      navigate('/quiz/male');  // Navigate to the men's quiz page
    } else if (gender === 'female') {
      navigate('/quiz/female');  // Navigate to the women's quiz page
    }
  };

  return (
    <div>
      <h2>Welcome to the Winx Club Quiz!</h2>
      <p>Are you a man or a woman?</p>
      <div>
        <button onClick={() => handleQuizChoice('male')}>Men's Quiz</button>
        <button onClick={() => handleQuizChoice('female')}>Women's Quiz</button>
      </div>
    </div>
  );
};

export default Home;