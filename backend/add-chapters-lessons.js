const mysql = require('mysql2/promise');
require('dotenv').config();

async function addChaptersAndLessons() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'lms_database'
    });

    console.log('Connected to database');

    // Get all courses
    const [courses] = await connection.execute('SELECT * FROM courses');
    console.log(`Found ${courses.length} courses`);

    for (const course of courses) {
      // Check if course already has chapters
      const [existingChapters] = await connection.execute(
        'SELECT COUNT(*) as count FROM chapters WHERE course_id = ?',
        [course.id]
      );

      if (existingChapters[0].count > 0) {
        console.log(`Course "${course.title}" already has chapters, skipping...`);
        continue;
      }

      console.log(`Adding chapters and lessons to: ${course.title}`);

      // Add 3 chapters per course
      const chapters = [
        { title: `Introduction to ${course.title}`, description: `Learn the basics of ${course.title}`, order: 1 },
        { title: `Advanced ${course.title}`, description: `Deep dive into ${course.title}`, order: 2 },
        { title: `Practical ${course.title}`, description: `Hands-on practice with ${course.title}`, order: 3 }
      ];

      for (const chapter of chapters) {
        // Insert chapter
        const [chapterResult] = await connection.execute(
          'INSERT INTO chapters (course_id, title, description, order_index, created_at) VALUES (?, ?, ?, ?, NOW())',
          [course.id, chapter.title, chapter.description, chapter.order]
        );

        const chapterId = chapterResult.insertId;

        // Add 2 lessons per chapter
        const lessons = [
          {
            title: chapter.order === 1 ? `Getting Started with ${course.title}` : 
                   chapter.order === 2 ? `Advanced Concepts in ${course.title}` : 
                   `Project Work - ${course.title}`,
            content: chapter.order === 1 ? `Welcome to ${course.title}. In this lesson, you will learn the fundamentals.` :
                     chapter.order === 2 ? `This lesson covers advanced topics in ${course.title}.` :
                     `Apply your knowledge with practical exercises in ${course.title}.`,
            order: 1
          },
          {
            title: chapter.order === 1 ? `Key Concepts - ${course.title}` :
                   chapter.order === 2 ? `Expert Techniques - ${course.title}` :
                   `Final Project - ${course.title}`,
            content: chapter.order === 1 ? `Learn the key concepts and terminology used in ${course.title}.` :
                     chapter.order === 2 ? `Master expert-level techniques in ${course.title}.` :
                     `Complete your final project to demonstrate mastery of ${course.title}.`,
            order: 2
          }
        ];

        for (const lesson of lessons) {
          await connection.execute(
            'INSERT INTO lessons (chapter_id, title, content, video_url, order_index, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [chapterId, lesson.title, lesson.content, 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', lesson.order]
          );
        }
      }

      console.log(`✅ Added 3 chapters and 6 lessons to "${course.title}"`);
    }

    await connection.end();
    console.log('\n🎉 Successfully added chapters and lessons to all courses!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

addChaptersAndLessons();