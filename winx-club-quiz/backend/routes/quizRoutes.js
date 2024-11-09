const express = require('express');
const router = express.Router();
const { getQuizQuestions, saveQuizResult } = require('../controllers/quizController');

router.get('/quiz/:gender', getQuizQuestions);
router.post('/save-quiz-result', saveQuizResult);

module.exports = router;
