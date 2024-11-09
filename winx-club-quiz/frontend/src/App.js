import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './components/Home';
import Quiz from './components/Quiz';
import QuizResult from './components/QuizResult';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/quiz-result" element={<QuizResult />} />
        {token ? (
          <Route path="/" element={<Home />} />
        ) : (
          <Route path="/" element={<Login />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;