const asyncHandler = require('express-async-handler');
const Project = require('../models/Project');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = asyncHandler(async (req, res) => {
  let projects;
  if (req.user.role === 'Admin') {
    projects = await Project.find({}).populate('members', 'name email');
  } else {
    projects = await Project.find({ members: req.user._id }).populate('members', 'name email');
  }
  res.status(200).json(projects);
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('members', 'name email');

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check access
  if (req.user.role !== 'Admin' && !project.members.some(m => m._id.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to access this project');
  }

  res.status(200).json(project);
});

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
const createProject = asyncHandler(async (req, res) => {
  const { title, description, deadline, members } = req.body;

  if (!title || !description || !deadline) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const project = await Project.create({
    title,
    description,
    deadline,
    members: members || [],
    createdBy: req.user._id
  });

  res.status(201).json(project);
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('members', 'name email');

  res.status(200).json(updatedProject);
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  await project.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
};
