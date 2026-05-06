const asyncHandler = require('express-async-handler');
const Task = require('../models/Task');
const Project = require('../models/Project');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = asyncHandler(async (req, res) => {
  let tasks;
  if (req.user.role === 'Admin') {
    tasks = await Task.find({}).populate('assignee', 'name email').populate('project', 'title');
  } else {
    // Member sees tasks assigned to them OR tasks in projects they are part of?
    // Let's only show tasks assigned to them to keep it clean, or we can show project tasks
    tasks = await Task.find({ assignee: req.user._id }).populate('assignee', 'name email').populate('project', 'title');
  }
  res.status(200).json(tasks);
});

// @desc    Get tasks by project
// @route   GET /api/tasks/project/:projectId
// @access  Private
const getTasksByProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  if (!project) {
    res.status(404);
    throw new Error('Project not found');
  }

  // Check access
  if (req.user.role !== 'Admin' && !project.members.includes(req.user._id)) {
    res.status(403);
    throw new Error('Not authorized to access these tasks');
  }

  const tasks = await Task.find({ project: req.params.projectId })
    .populate('assignee', 'name email');
  res.status(200).json(tasks);
});

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin)
const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority, dueDate, project, assignee } = req.body;

  if (!title || !description || !dueDate || !project) {
    res.status(400);
    throw new Error('Please add required fields');
  }

  const task = await Task.create({
    title,
    description,
    status: status || 'Pending',
    priority: priority || 'Medium',
    dueDate,
    project,
    assignee,
    createdBy: req.user._id
  });

  const createdTask = await Task.findById(task._id).populate('assignee', 'name email');
  res.status(201).json(createdTask);
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  // If Member, can only update status if assigned
  if (req.user.role === 'Member') {
    if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized to update this task');
    }
    
    // Member can only update status
    const allowedUpdates = ['status'];
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
      res.status(400);
      throw new Error('Members can only update task status');
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  ).populate('assignee', 'name email').populate('project', 'title');

  res.status(200).json(updatedTask);
});

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask
};
