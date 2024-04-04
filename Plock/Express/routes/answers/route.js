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

    let score = selectedOption.isCorrect ? 10 : 0;

    // Mark the task as completed for the user
    const userTask = await prisma.userTask.upsert({
        where: {
            userId_taskId: {
                userId: parseInt(userId, 10), // use userId from request body
                taskId: parseInt(taskId, 10), // use taskId from request body
            },
        },
        update: {
            completed: true,
            score: {
                increment: score, // increment the score by the calculated score
            },
        },
        create: {
            userId: parseInt(userId, 10), // use userId from request body
            taskId: parseInt(taskId, 10), // use taskId from request body
            completed: true,
            score: score, // set the score when creating a new user task
        },
    });

    // If the answer is correct, increment the user's score
    let user;
    if (selectedOption.isCorrect) {
        user = await prisma.user.update({
            where: { id: parseInt(userId, 10) },
            data: { score: { increment: 10 } },
        });
    }

    return res.status(201).json({ answer: createdAnswer, score: user ? user.score : 0 });
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