const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();


/**
 * 
 * This page is responsible for handling requests related to answers.
 * Submit with selected option being a question option id and the task id¨
 * Creating the body of the answer with the user id, question id, option id and task id
 * and the boolean value of the answer being correct or not
 * and getting the answers by user id and is correct filter
 */
router.post('/submit-task', async (req, res) => {
    const { userId, questionId, optionId, taskId } = req.body;

    // Validate request data
    if (!userId || !questionId || !optionId || !taskId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get the selected option from the database
    const selectedOption = await prisma.option.findUnique({
        where: { id: optionId },
    });

    // If the selected option doesn't exist, return an error
    if (!selectedOption) {
        return res.status(404).json({ error: 'Option not found' });
    }

     // Create answer in the database
     const createdAnswer = await prisma.answer.create({
        data: {
            userId,
            questionId,
            optionId,
            taskId: parseInt(taskId, 10),
            isCorrect: selectedOption.isCorrect,
        },
    });

    let userScore = 0;
    // If the answer is correct, increment the user's score
    if (selectedOption.isCorrect) {
        const score = await prisma.score.findFirst({
            where: { userId },
        });

        if (score) {
            // Update the user's score
            await prisma.score.update({
                where: { id: score.id },
                data: { value: score.value + 1 },
            });
            userScore = score.value + 1;
        } else {
            // Create a new score record for the user
            await prisma.score.create({
                data: {
                    value: 1,
                    userId,
                },
            });
            userScore = 1;
        }
    }

    return res.status(201).json({ answer: createdAnswer, score: userScore });
});

router.get('/get-answers', async (req, res) => {


    const userId = req.query.userId ? parseInt(req.query.userId) : undefined;

    const isCorrect = req.query.isCorrect === 'false' ? false : undefined;

    if (req.query.userId && parseInt(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const answers = await prisma.answer.findMany({
        where: {
            userId,
            isCorrect
        }
    });

    if (!answers.length) {
        return res.status(404).json({ error: 'No answers found' });
    }

    return res.json(answers);
});

router.get('/get-answers/:userId', async (req, res) => {
    const userId = parseInt(req.params.userId);

    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
    }

    const answers = await prisma.answer.findMany({
        where: { userId }
    });

    if (!answers.length) {
        return res.status(404).json({ error: 'No answers found for this user' });
    }

    return res.json(answers);
});

module.exports = router;