const express = require('express');
const { auth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Enroll in course (students only)
router.post('/enroll', auth, async (req, res) => {
  try {
    // Check if user is a student
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can enroll in courses' });
    }
    
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }
    
    // Check if course exists
    const [courseCheck] = await db.execute('SELECT id, title, price FROM courses WHERE id = ?', [courseId]);
    if (courseCheck.length === 0) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if already enrolled
    const [existing] = await db.execute(
      'SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?',
      [req.user.id, courseId]
    );
    
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }
    
    // Enroll the student
    await db.execute(
      'INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?, ?, NOW())',
      [req.user.id, courseId]
    );
    
    const course = courseCheck[0];
    
    // Create admin notification
    const notificationType = course.price > 0 ? 'payment' : 'enrollment';
    const notificationTitle = course.price > 0 ? 'New Payment Received' : 'New Enrollment';
    const notificationMessage = `${req.user.username} enrolled in "${course.title}"${course.price > 0 ? ` for $${course.price}` : ' (Free course)'}`;
    
    try {
      await db.execute(
        'INSERT INTO admin_notifications (type, title, message, user_id, course_id) VALUES (?, ?, ?, ?, ?)',
        [notificationType, notificationTitle, notificationMessage, req.user.id, courseId]
      );
    } catch (notifError) {
      console.log('Notification creation failed:', notifError.message);
    }
    
    res.json({ 
      message: 'Enrolled successfully',
      course: {
        id: course.id,
        title: course.title,
        price: course.price
      }
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get enrolled courses
router.get('/enrollments', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT c.*, u.username as instructor_name 
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON c.instructor_id = u.id
      WHERE e.user_id = ?
    `, [req.user.id]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get course content for enrolled student
router.get('/course/:courseId/content', auth, async (req, res) => {
  try {
    // Check if student is enrolled
    const [enrollment] = await db.execute(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [req.user.id, req.params.courseId]
    );
    
    if (enrollment.length === 0) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }
    
    // Get course with chapters and lessons
    const [course] = await db.execute(
      'SELECT * FROM courses WHERE id = ?',
      [req.params.courseId]
    );
    
    const [chapters] = await db.execute(
      'SELECT * FROM chapters WHERE course_id = ? ORDER BY order_index',
      [req.params.courseId]
    );
    
    // Get lessons for each chapter
    for (let chapter of chapters) {
      const [lessons] = await db.execute(
        'SELECT * FROM lessons WHERE chapter_id = ? ORDER BY order_index',
        [chapter.id]
      );
      chapter.lessons = lessons;
    }
    
    res.json({ course: course[0], chapters });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark lesson as completed
router.post('/lesson/:lessonId/complete', auth, async (req, res) => {
  try {
    await db.execute(
      'INSERT INTO lesson_progress (user_id, lesson_id, completed, completed_at) VALUES (?, ?, TRUE, NOW()) ON DUPLICATE KEY UPDATE completed = TRUE, completed_at = NOW()',
      [req.user.id, req.params.lessonId]
    );
    res.json({ message: 'Lesson marked as completed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;