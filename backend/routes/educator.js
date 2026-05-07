const express = require('express');
const { auth, educatorAuth } = require('../middleware/auth');
const Course = require('../models/Course');
const db = require('../config/database');

const router = express.Router();

// Get educator's courses
router.get('/courses', auth, educatorAuth, async (req, res) => {
  try {
    console.log('=== EDUCATOR COURSES DEBUG ===');
    console.log('Educator ID:', req.user.id);
    
    // Test basic query first
    const [basicRows] = await db.execute('SELECT * FROM courses WHERE instructor_id = ?', [req.user.id]);
    console.log('Basic courses:', basicRows);
    
    // Test enrollment count query
    const [enrollmentRows] = await db.execute('SELECT course_id, COUNT(*) as count FROM enrollments WHERE course_id IN (SELECT id FROM courses WHERE instructor_id = ?) GROUP BY course_id', [req.user.id]);
    console.log('Enrollment counts:', enrollmentRows);
    
    // Full query with joins
    const [rows] = await db.execute(`
      SELECT c.*, 
             COUNT(e.id) as enrolled_count,
             COALESCE(AVG(r.rating), 0) as avg_rating
      FROM courses c 
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN course_ratings r ON c.id = r.course_id
      WHERE c.instructor_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [req.user.id]);
    
    console.log('Final result with counts:', rows);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching educator courses:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all students enrolled in educator's courses
router.get('/students', auth, educatorAuth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT u.username as student_name, u.email as student_email,
             c.title as course_title, c.category as course_category,
             e.enrolled_at
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      WHERE c.instructor_id = ?
      ORDER BY e.enrolled_at DESC
    `, [req.user.id]);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;