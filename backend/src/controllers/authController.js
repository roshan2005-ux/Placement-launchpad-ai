import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// @desc    Register a new student
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide name, email, and password.',
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Basic email format validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide a valid email address.',
      });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 6 characters long.',
      });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email: trimmedEmail });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email already exists.',
      });
    }

    // Create user (password is automatically hashed by Mongoose pre-save hook)
    const user = await User.create({
      name: trimmedName,
      email: trimmedEmail,
      password,
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      status: 'success',
      message: 'Student account registered successfully.',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('[Register Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error during registration.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Please provide both email and password.',
      });
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Check user existence
    const user = await User.findOne({ email: trimmedEmail });
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      status: 'success',
      message: 'Login successful.',
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error('[Login Error]:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error during login.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    return res.status(200).json({
      status: 'success',
      user: req.user.toSafeObject(),
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching user session.',
    });
  }
};
