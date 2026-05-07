const mysql = require('mysql2/promise');
require('dotenv').config();

async function addLessonsToExistingCourses() {
  let connection;
  
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'lms_database'
    });
    
    console.log('Connected to database');
    
    // Get existing courses
    const [courses] = await connection.execute('SELECT id, title FROM courses ORDER BY id');
    console.log('Found courses:', courses.map(c => `${c.id}: ${c.title}`));
    
    if (courses.length === 0) {
      console.log('No courses found');
      return;
    }
    
    // Add chapters to Free HTML Course (assuming it's course ID 3 or find it)
    const freeCourse = courses.find(c => c.title.includes('HTML')) || courses[2];
    if (freeCourse) {
      console.log(`Adding content to: ${freeCourse.title} (ID: ${freeCourse.id})`);
      
      // Add chapter
      const [chapterResult] = await connection.execute(
        'INSERT INTO chapters (course_id, title, description, order_index) VALUES (?, ?, ?, ?)',
        [freeCourse.id, 'HTML Basics', 'Learn HTML fundamentals', 1]
      );
      
      const chapterId = chapterResult.insertId;
      console.log('Created chapter with ID:', chapterId);
      
      // Add lessons with videos
      const lessons = [
        ['HTML Introduction', 'Learn what HTML is', 'https://www.youtube.com/watch?v=UB1O30fR-EE', 10, 1],
        ['HTML Structure', 'Basic HTML document structure', 'https://www.youtube.com/watch?v=fNcJuPIZ2WE', 15, 2],
        ['HTML Elements', 'Common HTML elements', 'https://www.youtube.com/watch?v=cQT33yu9pY8', 12, 3]
      ];
      
      for (const lesson of lessons) {
        await connection.execute(
          'INSERT INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?, ?)',
          [chapterId, ...lesson]
        );
      }
      
      console.log(`Added ${lessons.length} lessons with videos`);
    }
    
    // Add content to other courses too
    for (let i = 0; i < Math.min(courses.length, 3); i++) {
      const course = courses[i];
      if (course.id === freeCourse.id) continue;
      
      // Check if course already has chapters
      const [existingChapters] = await connection.execute('SELECT id FROM chapters WHERE course_id = ?', [course.id]);
      if (existingChapters.length > 0) continue;
      
      console.log(`Adding content to: ${course.title} (ID: ${course.id})`);
      
      const [chapterResult] = await connection.execute(
        'INSERT INTO chapters (course_id, title, description, order_index) VALUES (?, ?, ?, ?)',
        [course.id, 'Getting Started', 'Introduction chapter', 1]
      );
      
      const chapterId = chapterResult.insertId;
      
      // Add sample lesson with video
      await connection.execute(
        'INSERT INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?, ?)',
        [chapterId, 'Introduction Video', 'Course introduction', 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', 15, 1]
      );
      
      console.log(`Added chapter and lesson to ${course.title}`);
    }
    
    console.log('✅ Successfully added lessons with videos to courses');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

addLessonsToExistingCourses();