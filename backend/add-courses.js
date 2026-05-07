const db = require('./config/database');

const sampleCourses = [
  { title: 'JavaScript Fundamentals', description: 'Learn the basics of JavaScript programming from scratch', category: 'Programming', price: 49.99, instructor_id: 2 },
  { title: 'React for Beginners', description: 'Build modern web applications with React.js', category: 'Programming', price: 79.99, instructor_id: 2 },
  { title: 'Node.js Backend Development', description: 'Create powerful backend applications with Node.js', category: 'Programming', price: 89.99, instructor_id: 2 },
  { title: 'Python Data Science', description: 'Master data analysis and visualization with Python', category: 'Data Science', price: 99.99, instructor_id: 2 },
  { title: 'Machine Learning Basics', description: 'Introduction to machine learning algorithms', category: 'Data Science', price: 129.99, instructor_id: 2 },
  { title: 'Digital Marketing Mastery', description: 'Complete guide to digital marketing strategies', category: 'Marketing', price: 69.99, instructor_id: 2 },
  { title: 'SEO Optimization', description: 'Improve your website ranking with SEO techniques', category: 'Marketing', price: 39.99, instructor_id: 2 },
  { title: 'Graphic Design Essentials', description: 'Learn design principles and Adobe Creative Suite', category: 'Design', price: 59.99, instructor_id: 2 },
  { title: 'UI/UX Design Fundamentals', description: 'Create user-friendly interfaces and experiences', category: 'Design', price: 89.99, instructor_id: 2 },
  { title: 'Photography Masterclass', description: 'Professional photography techniques and editing', category: 'Photography', price: 79.99, instructor_id: 2 },
  { title: 'Business Strategy', description: 'Develop winning business strategies and plans', category: 'Business', price: 99.99, instructor_id: 2 },
  { title: 'Project Management', description: 'Master project management methodologies', category: 'Business', price: 79.99, instructor_id: 2 },
  { title: 'Financial Planning', description: 'Personal and business financial management', category: 'Finance', price: 89.99, instructor_id: 2 },
  { title: 'Cryptocurrency Trading', description: 'Learn to trade cryptocurrencies safely', category: 'Finance', price: 149.99, instructor_id: 2 },
  { title: 'English Grammar', description: 'Master English grammar rules and usage', category: 'Language', price: 29.99, instructor_id: 2 },
  { title: 'Spanish Conversation', description: 'Improve your Spanish speaking skills', category: 'Language', price: 49.99, instructor_id: 2 },
  { title: 'Yoga for Beginners', description: 'Start your yoga journey with basic poses', category: 'Health', price: 39.99, instructor_id: 2 },
  { title: 'Nutrition and Diet', description: 'Learn about healthy eating and meal planning', category: 'Health', price: 59.99, instructor_id: 2 },
  { title: 'Music Theory', description: 'Understand the fundamentals of music theory', category: 'Music', price: 69.99, instructor_id: 2 },
  { title: 'Guitar Lessons', description: 'Learn to play guitar from beginner to advanced', category: 'Music', price: 79.99, instructor_id: 2 },
  { title: 'Creative Writing', description: 'Develop your writing skills and creativity', category: 'Writing', price: 49.99, instructor_id: 2 },
  { title: 'Content Marketing', description: 'Create engaging content that converts', category: 'Marketing', price: 59.99, instructor_id: 2 },
  { title: 'Excel Mastery', description: 'Advanced Excel formulas and data analysis', category: 'Business', price: 39.99, instructor_id: 2 },
  { title: 'WordPress Development', description: 'Build custom WordPress websites', category: 'Programming', price: 69.99, instructor_id: 2 },
  { title: 'Mobile App Design', description: 'Design beautiful mobile applications', category: 'Design', price: 99.99, instructor_id: 2 }
];

async function addSampleCourses() {
  try {
    console.log('Adding sample courses...');
    
    for (const course of sampleCourses) {
      const [result] = await db.execute(
        'INSERT INTO courses (title, description, category, price, instructor_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [course.title, course.description, course.category, course.price, course.instructor_id, 'published']
      );
      
      const courseId = result.insertId;
      console.log(`Added course: ${course.title} (ID: ${courseId})`);
      
      // Add 3-4 chapters per course
      const chapters = [
        { title: 'Introduction', description: 'Getting started with the basics', order_index: 1 },
        { title: 'Core Concepts', description: 'Understanding the fundamental concepts', order_index: 2 },
        { title: 'Practical Applications', description: 'Applying what you have learned', order_index: 3 },
        { title: 'Advanced Topics', description: 'Deep dive into advanced concepts', order_index: 4 }
      ];
      
      for (const chapter of chapters) {
        const [chapterResult] = await db.execute(
          'INSERT INTO chapters (course_id, title, description, order_index) VALUES (?, ?, ?, ?)',
          [courseId, chapter.title, chapter.description, chapter.order_index]
        );
        
        const chapterId = chapterResult.insertId;
        
        // Add 2-3 lessons per chapter
        const lessons = [
          { title: 'Lesson 1', content: 'First lesson content', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 600, order_index: 1 },
          { title: 'Lesson 2', content: 'Second lesson content', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 720, order_index: 2 },
          { title: 'Lesson 3', content: 'Third lesson content', video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: 540, order_index: 3 }
        ];
        
        for (const lesson of lessons) {
          await db.execute(
            'INSERT INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?, ?)',
            [chapterId, lesson.title, lesson.content, lesson.video_url, lesson.duration, lesson.order_index]
          );
        }
      }
      
      // Add some random enrollments and ratings
      if (Math.random() > 0.5) {
        await db.execute(
          'INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?, ?, NOW())',
          [3, courseId]
        );
        
        const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars
        await db.execute(
          'INSERT INTO course_ratings (user_id, course_id, rating, review) VALUES (?, ?, ?, ?)',
          [3, courseId, rating, 'Great course!']
        );
      }
    }
    
    console.log('✅ Successfully added all sample courses!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error adding courses:', error);
    process.exit(1);
  }
}

addSampleCourses();