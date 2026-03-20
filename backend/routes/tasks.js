const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Get Dashboard Stats
router.get('/dashboard', auth, async (req, res) => {
  try {
    const total = await Task.countDocuments({ user: req.user.id });
    const completed = await Task.countDocuments({ user: req.user.id, status: 'Completed' });
    const pending = await Task.countDocuments({ user: req.user.id, status: 'Pending' });
    res.json({ total, completed, pending });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Create Task
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, priority, deadline } = req.body;
    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      priority,
      deadline
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get Tasks
router.get('/', auth, async (req, res) => {
  try {
    const { status, priority, search, sortBy, page = 1, limit = 10 } = req.query;
    let query = { user: req.user.id };

    if (status && status !== 'All') query.status = status;
    if (priority && priority !== 'All') query.priority = priority;
    if (search) query.title = { $regex: search, $options: 'i' };

    let sortObj = { createdAt: -1 }; 
    if (sortBy === 'deadline') sortObj = { deadline: 1 };

    const tasks = await Task.find(query)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Task.countDocuments(query);

    res.json({
      tasks,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      totalTasks: count
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update Task
router.put('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (task.user.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
