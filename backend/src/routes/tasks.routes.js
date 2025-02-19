const express = require('express');
const Task = require('../models/task.model');
const { authenticateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// middleware
// Authentication is applied to all routes
router.use(authenticateToken);

// requires user to be logged in for all routes
router.use((req, res, next) => {
  if(!req.user){
    return res.status(401).json({ message: 'Authentication required '});
  }
  next();
});


// GET route - retrieves tasks
router.get('/', async(req, res) => {
  try {
    const where = {};

    // Filter by user
    if(req.user) {
      where.userId = req.user.id;
    }

    const tasks = await Task.findAll({ where })
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving tasks '});
  }
});

// POST route - creates tasks
router.post('/', async(req, res) => {
  try {
    const { title, description, isComplete } = req.body;

    const task = await Task.create({
      title,
      description,
      isComplete: isComplete || false,
      userId: req.user ? req.user.id : null
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating tasks: ', error);
    res.status(400).json({ message: 'Error creating task' });
  }
});

// PUT route - updates tasks
router.put('/:id', async(req, res) => {
  try {
    const { title, description, isComplete } = req.body;

    const task = await Task.findByPk(req.params.id);

    if(!task){
      return res.status(404).json({ message: 'Error: task not found '});
    }

    // task is found, so update the task
    if(title !== undefined) task.title = title;
    if(description !== undefined) task.description = description;
    if(isComplete !== undefined) task.isComplete = isComplete;

    await task.save();

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task '});
  }
})

// DELETE route - deletes tasks
router.delete('/:id', async(req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);

    if(!task){
      return res.status(404).json({message: 'Error: task not found'});
    }

    await task.destroy();

    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({message: 'Error deleting task'});
  }
});

module.exports = router;