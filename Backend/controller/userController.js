const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

module.exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide all required fields' 
      });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists' 
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'customer' 
    });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error during registration',
      error: err.message 
    });
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token: generateToken(user),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });

  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: err.message
    });
  }
};
