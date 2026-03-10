import User from '../models/User.js';
import { InMemoryUser } from '../models/InMemoryUser.js';
import jwt from 'jsonwebtoken';

// Determine if we're using MongoDB or fallback
let userModel = User;
let isMongoDBAvailable = true;

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'your_jwt_secret_key_change_this_in_production',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    // Check if user already exists
    let user = await userModel.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Create new user
    user = await userModel.create({ name, email, password });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller,
      },
      token,
    });
  } catch (error) {
    console.error('Register error:', error);

    // Fallback to in-memory storage
    if (!isMongoDBAvailable || error.message.includes('buffering timed out')) {
      console.log('Falling back to in-memory storage...');
      userModel = InMemoryUser;
      isMongoDBAvailable = false;

      try {
        const { name, email, password } = req.body;
        let user = await userModel.findOne({ email });

        if (user) {
          return res.status(400).json({ success: false, message: 'User already exists with this email' });
        }

        user = await userModel.create({ name, email, password });
        const token = generateToken(user._id);

        return res.status(201).json({
          success: true,
          message: 'User registered successfully (using fallback storage)',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isSeller: user.isSeller,
          },
          token,
        });
      } catch (fallbackError) {
        return res.status(500).json({ success: false, message: fallbackError.message });
      }
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // Find user and select password
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller,
      },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);

    // Fallback to in-memory storage
    if (!isMongoDBAvailable || error.message.includes('buffering timed out')) {
      console.log('Falling back to in-memory storage...');
      userModel = InMemoryUser;
      isMongoDBAvailable = false;

      try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user) {
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
          return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        return res.status(200).json({
          success: true,
          message: 'Login successful (using fallback storage)',
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            isSeller: user.isSeller,
          },
          token,
        });
      } catch (fallbackError) {
        return res.status(500).json({ success: false, message: fallbackError.message });
      }
    }

    res.status(500).json({ success: false, message: error.message });
  }
};

// Get current user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isSeller: user.isSeller,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
