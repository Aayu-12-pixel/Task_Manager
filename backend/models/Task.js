const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['High', 'Medium', 'Low'], default: 'Medium' },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  deadline: { type: Date },
  subtasks: [{
    title: { type: String, required: true },
    isCompleted: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
