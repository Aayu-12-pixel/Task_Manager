const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Task = require('../models/Task');

// Get all users with task counts
router.get('/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    
    // Attach task aggregate info to each user
    const usersWithStats = await Promise.all(users.map(async (u) => {
      const totalTasks = await Task.countDocuments({ user: u._id });
      const completedTasks = await Task.countDocuments({ user: u._id, status: 'Completed' });
      const pendingTasks = totalTasks - completedTasks;
      return { ...u, totalTasks, completedTasks, pendingTasks };
    }));

    res.json(usersWithStats);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
