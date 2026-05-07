const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Role-specific registration routes
router.post('/admin/register', (req, res) => {
  req.body.role = 'admin';
  register(req, res);
});

router.post('/educator/register', (req, res) => {
  req.body.role = 'educator';
  register(req, res);
});

router.post('/student/register', (req, res) => {
  req.body.role = 'student';
  register(req, res);
});

// Role-specific login routes
router.post('/admin/login', login);
router.post('/educator/login', login);
router.post('/student/login', login);

// General routes (backward compatibility)
router.post('/register', register);
router.post('/login', login);

module.exports = router;