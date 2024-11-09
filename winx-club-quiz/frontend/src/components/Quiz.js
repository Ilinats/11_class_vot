import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Quiz.css';

const Quiz = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { username, gender } = location.state || {};
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('userToken');

  useEffect(() => {
    if (gender) {
      setLoading(true);

      fetch(`http://localhost:5000/api/quiz/${gender}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data) && data.every(q => q.question && Array.isArray(q.answers))) {
            setQuestions(data);
            setError(null);
          } else {
            setError('Quiz data is not in the expected format.');
          }
        })
        .catch(err => {
          console.error('Error fetching quiz data:', err);
          setError('Failed to load quiz data. Please try again.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [gender, token]);

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = {
      text: answer.text,
      characters: answer.characters,
    };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleSubmitQuiz();
      }
    }, 200);
  };

  const handleSubmitQuiz = () => {
    fetch('http://localhost:5000/api/save-quiz-result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
        gender,
        answers,
      }),
    })
      .then(response => response.json())
      .then(data => {
        if (data.result) {
            console.log(data.image);
          navigate('/quiz-result', {
            state: {
              username,
              result: data.result,
              description: data.description,
              image: data.image,
            },
          });
        } else {
          alert('An error occurred while submitting your quiz results. Please try again.');
        }
      })
      .catch(err => {
        console.error('Error submitting quiz:', err);
        alert('An error occurred while submitting your quiz results. Please try again.');
      });
  };

  if (loading) {
    return <div className="loading">Loading quiz...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="quiz-container">
      <h1>Quiz: {gender === 'men' ? 'Men' : 'Women'} Characters</h1>

      <div>
        <h2>{questions[currentQuestion]?.question || 'Loading question...'}</h2>
        <ul>
          {questions[currentQuestion]?.answers?.map((answer, index) => (
            <li key={index}>
              <input
                type="radio"
                id={`answer-${index}`}
                name={`question-${currentQuestion}`}
                value={answer.text}
                onChange={() => handleAnswerChange(currentQuestion, answer)}
              />
              <label htmlFor={`answer-${index}`}>{answer.text}</label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Quiz;