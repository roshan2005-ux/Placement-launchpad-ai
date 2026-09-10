import User from '../models/User.js';

// @desc    Get current student's profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found.',
      });
    }

    return res.status(200).json({
      status: 'success',
      profile: user.toSafeObject(),
    });
  } catch (error) {
    console.error('[Get Profile Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve profile.',
    });
  }
};

// @desc    Update current student's profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Student profile not found.',
      });
    }

    const {
      name,
      college,
      degree,
      branch,
      year,
      targetJobRole,
      skills,
      careerGoal,
    } = req.body;

    if (name !== undefined) user.name = name.trim();
    if (college !== undefined) user.college = college.trim();
    if (degree !== undefined) user.degree = degree.trim();
    if (branch !== undefined) user.branch = branch.trim();
    if (year !== undefined) user.year = year.trim();
    if (targetJobRole !== undefined) user.targetJobRole = targetJobRole.trim();
    if (careerGoal !== undefined) user.careerGoal = careerGoal.trim();

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        user.skills = skills.map((s) => String(s).trim()).filter(Boolean);
      } else if (typeof skills === 'string') {
        user.skills = skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    const updatedUser = await user.save();

    return res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully.',
      profile: updatedUser.toSafeObject(),
    });
  } catch (error) {
    console.error('[Update Profile Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to update profile.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
