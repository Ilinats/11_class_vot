import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/QuizResult.css';

const QuizResult = () => {
    const location = useLocation();
  
    const { result, description, image} = location.state || {};
  
    return (
        <div className="quiz-result-container">
            <h1>Your Result</h1>
            {result && <h2>You are {result}</h2>}
            {image && <img src={image} alt={result} />}
            {description && <p>{description}</p>}
        </div>
    );
};
  
export default QuizResult;