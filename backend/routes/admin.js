const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get dashboard stats
router.get('/dashboard', auth, adminAuth, async (req, res) => {
  try {
    const [users] = await db.execute('SELECT role, COUNT(*) as count FROM users GROUP BY role');
    const [courses] = await db.execute('SELECT status, COUNT(*) as count FROM courses GROUP BY status');
    const [enrollments] = await db.execute('SELECT COUNT(*) as total FROM enrollments');
    const [revenue] = await db.execute('SELECT SUM(price) as total FROM courses c JOIN enrollments e ON c.id = e.course_id WHERE c.price > 0');
    
    const userStats = users.reduce((acc, curr) => {
      acc[curr.role] = curr.count;
      return acc;
    }, {});
    
    const courseStats = courses.reduce((acc, curr) => {
      acc[curr.status] = curr.count;
      return acc;
    }, {});
    
    res.json({
      users: {
        total_users: Object.values(userStats).reduce((a, b) => a + b, 0),
        total_students: userStats.student || 0,
        total_educators: userStats.educator || 0,
        total_admins: userStats.admin || 0
      },
      courses: {
        total_courses: Object.values(courseStats).reduce((a, b) => a + b, 0),
        published_courses: courseStats.published || 0,
        draft_courses: courseStats.draft || 0,
        archived_courses: courseStats.archived || 0
      },
      enrollments: {
        total_enrollments: enrollments[0].total || 0
      },
      payments: {
        total_revenue: revenue[0].total || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get detailed student information
router.get('/students', auth, adminAuth, async (req, res) => {
  try {
    const [students] = await db.execute(`
      SELECT u.id, u.username, u.email, u.created_at,
             COUNT(DISTINCT e.course_id) as enrolled_courses,
             SUM(CASE WHEN c.price > 0 THEN c.price ELSE 0 END) as total_spent
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN courses c ON e.course_id = c.id
      WHERE u.role = 'student'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get detailed educator information
router.get('/educators', auth, adminAuth, async (req, res) => {
  try {
    const [educators] = await db.execute(`
      SELECT u.id, u.username, u.email, u.created_at,
             COUNT(DISTINCT c.id) as total_courses,
             COUNT(DISTINCT CASE WHEN c.status = 'published' THEN c.id END) as published_courses,
             COUNT(DISTINCT e.user_id) as total_students,
             SUM(CASE WHEN c.price > 0 THEN c.price * (SELECT COUNT(*) FROM enrollments WHERE course_id = c.id) ELSE 0 END) as total_revenue
      FROM users u
      LEFT JOIN courses c ON u.id = c.instructor_id
      LEFT JOIN enrollments e ON c.id = e.course_id
      WHERE u.role = 'educator'
      GROUP BY u.id
      ORDER BY u.created_at DESC
    `);
    res.json(educators);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get student progress details
router.get('/student/:id/progress', auth, adminAuth, async (req, res) => {
  try {
    const [progress] = await db.execute(`
      SELECT c.title as course_title, c.price, e.enrolled_at, e.progress,
             COUNT(DISTINCT l.id) as total_lessons,
             COUNT(DISTINCT lp.lesson_id) as completed_lessons
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      LEFT JOIN chapters ch ON c.id = ch.course_id
      LEFT JOIN lessons l ON ch.id = l.chapter_id
      LEFT JOIN lesson_progress lp ON l.id = lp.lesson_id AND lp.user_id = e.user_id AND lp.completed = TRUE
      WHERE e.user_id = ?
      GROUP BY c.id
      ORDER BY e.enrolled_at DESC
    `, [req.params.id]);
    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all courses
router.get('/courses', auth, adminAuth, async (req, res) => {
  try {
    const [courses] = await db.execute(`
      SELECT c.*, u.username as instructor_name,
             COUNT(e.id) as enrolled_count
      FROM courses c 
      LEFT JOIN users u ON c.instructor_id = u.id 
      LEFT JOIN enrollments e ON c.id = e.course_id
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get enrollments (as payments)
router.get('/payments', auth, adminAuth, async (req, res) => {
  try {
    const [payments] = await db.execute(`
      SELECT e.*, c.title as course_title, c.price as amount,
             u.username as student_name, 'completed' as status,
             'demo' as payment_method, e.enrolled_at as payment_date
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      JOIN users u ON e.user_id = u.id
      WHERE c.price > 0
      ORDER BY e.enrolled_at DESC
    `);
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user role
router.put('/user-role', auth, adminAuth, async (req, res) => {
  try {
    const { user_id, role } = req.body;
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, user_id]);
    res.json({ message: 'User role updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete user
router.delete('/user/:id', auth, adminAuth, async (req, res) => {
  try {
    await db.execute('DELETE FROM users WHERE id = ? AND role != "admin"', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get admin notifications
router.get('/notifications', auth, adminAuth, async (req, res) => {
  try {
    const [notifications] = await db.execute(`
      SELECT n.*, u.username, c.title as course_title
      FROM admin_notifications n
      LEFT JOIN users u ON n.user_id = u.id
      LEFT JOIN courses c ON n.course_id = c.id
      ORDER BY n.created_at DESC
      LIMIT 50
    `);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get recent activity for admin dashboard
router.get('/activity', auth, adminAuth, async (req, res) => {
  try {
    const [activity] = await db.execute(`
      SELECT 
        'enrollment' as type, 
        CONCAT(u.username, ' enrolled in "', c.title, '"') as message,
        e.enrolled_at as created_at,
        u.username as user_name,
        c.title as course_title,
        c.price
      FROM enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN courses c ON e.course_id = c.id
      
      UNION ALL
      
      SELECT 
        'course_created' as type,
        CONCAT(u.username, ' created course "', c.title, '"') as message,
        c.created_at,
        u.username as user_name,
        c.title as course_title,
        c.price
      FROM courses c
      JOIN users u ON c.instructor_id = u.id
      
      UNION ALL
      
      SELECT 
        'user_registered' as type,
        CONCAT(username, ' registered as ', role) as message,
        created_at,
        username as user_name,
        NULL as course_title,
        NULL as price
      FROM users
      WHERE role IN ('student', 'educator')
      
      ORDER BY created_at DESC
      LIMIT 20
    `);
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;