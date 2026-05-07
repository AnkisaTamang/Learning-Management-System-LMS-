const express = require('express');
const { auth, educatorAuth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Get chapters for a course
router.get('/course/:courseId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM chapters WHERE course_id = ? ORDER BY order_index',
      [req.params.courseId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create new chapter
router.post('/', auth, async (req, res) => {
  try {
    const { course_id, title, description, order_index } = req.body;
    
    console.log('Creating chapter:', { course_id, title, user_id: req.user.id });
    
    if (!course_id || !title) {
      return res.status(400).json({ message: 'Course ID and title are required' });
    }
    
    const [result] = await db.execute(
      'INSERT INTO chapters (course_id, title, description, order_index) VALUES (?, ?, ?, ?)',
      [course_id, title, description || '', order_index || 1]
    );
    
    console.log('Chapter created successfully:', result.insertId);
    res.status(201).json({ message: 'Chapter created successfully', chapterId: result.insertId });
  } catch (error) {
    console.error('Chapter creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete chapter
router.delete('/:id', auth, educatorAuth, async (req, res) => {
  try {
    await db.execute('DELETE FROM chapters WHERE id = ?', [req.params.id]);
    res.json({ message: 'Chapter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get lessons for a chapter
router.get('/:chapterId/lessons', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM lessons WHERE chapter_id = ? ORDER BY order_index',
      [req.params.chapterId]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Test endpoint for debugging
router.get('/test', (req, res) => {
  res.json({ message: 'Chapters API is working', timestamp: new Date().toISOString() });
});

// Add lesson to chapter
router.post('/:chapterId/lessons', auth, async (req, res) => {
  try {
    const { title, content, video_url, duration, order_index } = req.body;
    const chapterId = req.params.chapterId;
    
    console.log('=== LESSON CREATION DEBUG ===');
    console.log('Chapter ID:', chapterId);
    console.log('Request body:', req.body);
    console.log('User from token:', req.user);
    console.log('Headers:', req.headers);
    
    if (!title || title.trim() === '') {
      console.log('❌ Missing title');
      return res.status(400).json({ message: 'Lesson title is required' });
    }
    
    // Check if chapter exists
    console.log('Checking if chapter exists...');
    const [chapterCheck] = await db.execute('SELECT id, course_id FROM chapters WHERE id = ?', [chapterId]);
    if (chapterCheck.length === 0) {
      console.log('❌ Chapter not found');
      return res.status(404).json({ message: 'Chapter not found' });
    }
    console.log('✅ Chapter found:', chapterCheck[0]);
    
    // Insert lesson
    console.log('Inserting lesson...');
    const [result] = await db.execute(
      'INSERT INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?, ?)',
      [chapterId, title, content || '', video_url || '', parseInt(duration) || 0, parseInt(order_index) || 1]
    );
    
    console.log('✅ Lesson created successfully with ID:', result.insertId);
    
    const responseData = { 
      message: 'Lesson created successfully', 
      lessonId: result.insertId,
      lesson: {
        id: result.insertId,
        chapter_id: chapterId,
        title,
        content: content || '',
        video_url: video_url || '',
        duration: parseInt(duration) || 0,
        order_index: parseInt(order_index) || 1
      }
    };
    
    console.log('Sending response:', responseData);
    res.status(201).json(responseData);
    
  } catch (error) {
    console.error('❌ Lesson creation error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;