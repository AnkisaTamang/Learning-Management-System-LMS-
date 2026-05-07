const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const db = require('../config/database');

const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const userId = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'student'
    });

    // Create admin notification
    try {
      await db.execute(
        'INSERT INTO admin_notifications (type, title, message, user_id) VALUES (?, ?, ?, ?)',
        ['user_registered', 'New User Registered', `${username} registered as ${role || 'student'}`, userId]
      );
      console.log('Notification created for user:', username);
    } catch (notificationError) {
      console.error('Failed to create notification:', notificationError);
      // Don't fail the registration if notification fails
    }

    res.status(201).json({ message: 'User created successfully', userId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { register, login };