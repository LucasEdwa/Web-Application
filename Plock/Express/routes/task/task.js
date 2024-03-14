const router = require('express').Router();
const { verifyToken, verifyRole } = require('../middlewares/authMiddleware');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
router.get('/get-tasks', verifyToken,  async (req, res) => {
   try{
;
    const tasks = await prisma.task.findMany();

    const filteredTasks = tasks.filter(task => 
        task.role === user.role);
        

        return res.json(filteredTasks);
    }catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Failed to fetch tasks', details: error.message });

   }
});

module.exports = router;