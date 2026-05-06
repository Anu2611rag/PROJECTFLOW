const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(protect, getTasks)
  .post(protect, authorize('Admin'), createTask);

router.get('/project/:projectId', protect, getTasksByProject);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, authorize('Admin'), deleteTask);

module.exports = router;
