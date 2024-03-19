const express = require('express');
const router = express.Router();
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**Create a full body to questions and what is needed to correction
 * As we need to create a task with questions and options Db-models, I requered a Array to be passed
 * in this body of the request including the user id and the role of the user that is creating the task
 * in case of the user is a supervisor, the user id is not required.
 * 
 * 
  */
// Manage tasks
router.post('/create-tasks', async (req, res) => {
    const { title, description, userId, questions, role } = req.body;
    if (!Array.isArray(questions)) {
        return res.status(400).json({ error: "Invalid input: 'questions' must be an array." });
      }
    try {
        
        const newTask = await prisma.task.create({
            data: {
                title,
                description,
                userId: userId || null,
                completed: false,
                role,
                questions: {
                    create: questions.map(q => ({
                        question: q.question,
                        correctAnswerIndex: q.correctAnswerIndex,
                        options: {
                            create: q.options
                        }
                    }))
                }
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });

        return res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to create task', details: error.message });
    }
});
// Manage tasks
router.patch('/tasks/:id', verifyToken,  async (req, res) => {
    const taskId = req.params.id;
    const { completed } = req.body;

    try {
        const task = await task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: `Task with id ${taskId} not found` });
        }

        task.completed = completed;
        await task.save();

        return res.json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to complete task', details: error.message });
    }
})
router.get('/taskById/:taskId', verifyToken,  async (req, res) => {

    const taskId = parseInt(req.params.taskId, 10);
  
        try {

        const task = await prisma.task.findUnique({
            where: {
                id: taskId
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });


        if (!task) {
            return res.status(404).json({ error: `Task with id ${taskId} not found` });
        }

        return res.json(task);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch task', details: error.message });
    }
});

/** wrong attempt to get task by Role trying to get the tasks in db 
 * then filter the tasks by role and return the filtered tasks
 */
router.get('/get-tasks', verifyToken,  async (req, res) => {
    try {
        const tasks = await prisma.task.findMany();
        return res.json(tasks);
    } catch (error) {
        console.error(error);
        if (error instanceof prisma.PrismaClientKnownRequestError) {
            // Handle known Prisma errors
            return res.status(500).json({ error: 'Database error', details: error.message });
        } else {
            // Handle unknown errors
            return res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });
        }
    }
});

module.exports = router;