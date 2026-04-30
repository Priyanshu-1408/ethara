const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect, checkRole } = require('../middleware/authMiddleware');

// @route   POST /api/projects
// @desc    Create a new project
// @access  Private/Admin
router.post('/', protect, checkRole('Admin'), async (req, res) => {
  try {
    const { title, description, members } = req.body;
    
    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: members || []
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/projects
// @desc    Get all projects for the logged-in user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({
      $or: [{ createdBy: req.user._id }, { members: req.user._id }]
    });

    const formattedProjects = projects.map(p => ({
      _id: p._id,
      title: p.title,
      description: p.description
    }));

    res.json(formattedProjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/projects/:id/members
// @desc    Add a member to a project
// @access  Private/Admin
router.put('/:id/members', protect, checkRole('Admin'), async (req, res) => {
  try {
    const { userId } = req.body;
    
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this project' });
    }

    project.members.push(userId);
    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/projects/:id/members/:userId
// @desc    Remove a member from a project
// @access  Private/Admin
router.delete('/:id/members/:userId', protect, checkRole('Admin'), async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    project.members = project.members.filter(
      (memberId) => memberId.toString() !== req.params.userId
    );

    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
