const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Please add a task title'] },
  description: { type: String },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: [true, 'Please provide a project ID'] },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  dueDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
