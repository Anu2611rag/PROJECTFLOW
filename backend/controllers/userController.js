const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Get all users
// @route   GET /api/users
// @access  Private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.status(200).json(users);
});

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Private (Admin)
const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Prevent admin from downgrading themselves to Member if they are the only admin
  // (Optional, but good practice). We'll just allow it for now or assume they know what they're doing.
  
  if (req.body.role && ['Admin', 'Member'].includes(req.body.role)) {
    user.role = req.body.role;
    await user.save();
  }

  res.status(200).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

module.exports = {
  getUsers,
  updateUserRole
};
