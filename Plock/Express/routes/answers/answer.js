// answerRoutes.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// POST /api/answers
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

    // If the answer is correct, increment the user's score
    if (selectedOption.isCorrect) {
        const userScore = await prisma.score.findFirst({
            where: { userId },
        });

        if (userScore) {
            // Update the user's score
            await prisma.score.update({
                where: { id: userScore.id },
                data: { value: userScore.value + 1 },
            });
        } else {
            // Create a new score record for the user
            await prisma.score.create({
                data: {
                    value: 1,
                    userId,
                },
            });
        }
    }

    return res.status(201).json(createdAnswer);
});

router.get('/get-answers', async (req, res) => {
    const userId = req.query.userId ? parseInt(req.query.userId) : undefined;
    const isCorrect = req.query.isCorrect === 'false' ? false : undefined;

    if (req.query.userId && isNaN(userId)) {
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