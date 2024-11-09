const { menQuizQuestions } = require('../data/menQuizData'); 
const { womenQuizQuestions } = require('../data/womenQuizData');
const characterDescriptions = require('../data/characterDescriptions'); 
const client = require('../db/db');
const { json } = require('sequelize');

function calculateResult(quizData, answers) {
    const characterCounts = {};
  
    answers.forEach(answer => {
      answer.characters.forEach(character => {
        characterCounts[character] = (characterCounts[character] || 0) + 1;
      });
    });
  
    const sortedCharacters = Object.entries(characterCounts)
      .sort((a, b) => b[1] - a[1]);
  
    const mostSimilarCharacter = sortedCharacters[0][0];
    const characterInfo = characterDescriptions[mostSimilarCharacter];
  
    return {
      character: mostSimilarCharacter,
      description: characterInfo.description || "You are unique, just like everyone else!",
      image: characterInfo.image || null
    };
}

exports.getQuizQuestions = (req, res) => {
    const { gender } = req.params;
    console.log(gender);

    console.log(menQuizQuestions);
    console.log(womenQuizQuestions);
  
    if (gender === 'male') {
      return res.json(menQuizQuestions);
    } else if (gender === 'female') {
      return res.json(womenQuizQuestions);
    } else {
      return res.status(400).json({ message: 'Invalid gender' });
    }
  };
  

exports.saveQuizResult = async (req, res) => {
    const { username, gender, answers } = req.body;

    console.log(username, gender, answers);

    try {
        const quizData = gender === 'male' ? json(menQuizQuestions) : json(womenQuizQuestions);
        const result = calculateResult(quizData, answers);

        const existingResult = await client.query(
        'SELECT * FROM quiz_results WHERE username = $1',
        [username]
        );

        if (existingResult.rows.length > 0) {
        await client.query(
            'UPDATE quiz_results SET result = $1 WHERE username = $2',
            [result.character, username]
        );
        return res.status(200).json({
            message: 'Quiz result updated',
            result: result.character,
            description: result.description
        });
        } else {
            await client.query(
                'INSERT INTO quiz_results (username, result) VALUES ($1, $2)',
                [username, result.character]
            );
            return res.status(200).json({
                message: 'Quiz result updated',
                result: result.character,
                description: result.description,
                image: result.image
            });        
        }
    } catch (error) {
        console.error('Error saving quiz result:', error);
        return res.status(500).json({ message: 'Failed to save result', error });
    }
};
