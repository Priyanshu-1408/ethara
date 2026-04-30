const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Task = require('../models/Task');
const { protect, checkRole } = require('../middleware/authMiddleware');

// @route   POST /api/tasks
// @desc    Create a new task (Admin only)
// @access  Private/Admin
router.post('/', protect, checkRole('Admin'), async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, dueDate, status } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ message: 'Title and projectId are required' });
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid projectId format' });
    }

    const task = await Task.create({
      title,
      description,
      projectId,
      assignedTo: assignedTo || null,
      dueDate,
      status: status || 'Todo',
      createdBy: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id/assign
// @desc    Assign task to a user
// @access  Private/Admin
router.put('/:id/assign', protect, checkRole('Admin'), async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    if (!assignedTo) {
      return res.status(400).json({ message: 'assignedTo user ID is required' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.assignedTo = assignedTo;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id/status
// @desc    Update task status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status || !['Todo', 'In Progress', 'Done'].includes(status)) {
      return res.status(400).json({ message: 'Valid status is required (Todo, In Progress, Done)' });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only Admin or the assigned user can update the status
    if (req.user.role !== 'Admin' && task.assignedTo?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task status' });
    }

    task.status = status;
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks/summary
// @desc    Get task summary (Total, By Status, Overdue)
// @access  Private
router.get('/summary', protect, async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'Admin') {
      filter.assignedTo = req.user._id;
    }
    
    const totalTasks = await Task.countDocuments(filter);
    
    const todoTasks = await Task.countDocuments({ ...filter, status: 'Todo' });
    const inProgressTasks = await Task.countDocuments({ ...filter, status: 'In Progress' });
    const doneTasks = await Task.countDocuments({ ...filter, status: 'Done' });
    
    const overdueTasks = await Task.countDocuments({ 
      ...filter, 
      dueDate: { $lt: new Date() }, 
      status: { $ne: 'Done' } 
    });

    res.json({
      total: totalTasks,
      status: {
        todo: todoTasks,
        inProgress: inProgressTasks,
        done: doneTasks
      },
      overdue: overdueTasks
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/tasks
// @desc    Get tasks by user or project (Query params: ?projectId=xyz & ?assignedTo=xyz)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { projectId, assignedTo } = req.query;
    
    let filter = {};

    // Apply query filters if they exist
    if (projectId) filter.projectId = projectId;
    
    // If not admin, restrict the scope to their own tasks unless fetching project tasks (you might want to restrict project tasks to project members, but we'll stick to a basic restriction here).
    if (req.user.role !== 'Admin') {
       // Regular member sees only tasks assigned to them, or if projectId is specified, they should ideally only see it if they are in the project.
       // For simplicity, we just enforce that they only see their assigned tasks unless fetching a specific project where they are a member (this requires joining with Project).
       // Here we just merge with assignedTo: req.user._id if no specific user is requested, or if they request someone else's, block it.
       if (assignedTo && assignedTo !== req.user._id.toString()) {
         return res.status(403).json({ message: 'Not authorized to view other users tasks' });
       }
       filter.assignedTo = req.user._id;
    } else if (assignedTo) {
       filter.assignedTo = assignedTo;
    }

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('projectId', 'title');
      
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private/Admin
router.delete('/:id', protect, checkRole('Admin'), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
