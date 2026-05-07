const db = require('./config/database');

const instructorProfiles = [
  { username: 'sarah_tech', email: 'sarah@tech.com', password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'educator' },
  { username: 'mike_design', email: 'mike@design.com', password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'educator' },
  { username: 'lisa_business', email: 'lisa@business.com', password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'educator' },
  { username: 'david_health', email: 'david@health.com', password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'educator' },
  { username: 'anna_creative', email: 'anna@creative.com', password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', role: 'educator' }
];

const diverseCourses = [
  // Tech Courses - High content, expensive
  { title: 'Advanced React & Redux', description: 'Master React with Redux state management', category: 'Programming', price: 199.99, chapters: 8, lessons: 32, duration: 2400 },
  { title: 'Full Stack JavaScript', description: 'Complete MERN stack development', category: 'Programming', price: 249.99, chapters: 12, lessons: 48, duration: 3600 },
  { title: 'Python Machine Learning', description: 'AI and ML with Python libraries', category: 'Data Science', price: 179.99, chapters: 10, lessons: 40, duration: 3000 },
  
  // Design Courses - Medium content, moderate price
  { title: 'UI/UX Design Mastery', description: 'Complete design workflow', category: 'Design', price: 129.99, chapters: 6, lessons: 24, duration: 1800 },
  { title: 'Adobe Creative Suite', description: 'Photoshop, Illustrator, InDesign', category: 'Design', price: 149.99, chapters: 9, lessons: 36, duration: 2700 },
  { title: 'Brand Identity Design', description: 'Create memorable brand identities', category: 'Design', price: 99.99, chapters: 5, lessons: 20, duration: 1500 },
  
  // Business Courses - Low content, high price
  { title: 'Startup Strategy', description: 'Build and scale startups', category: 'Business', price: 299.99, chapters: 4, lessons: 16, duration: 1200 },
  { title: 'Digital Marketing ROI', description: 'Maximize marketing returns', category: 'Marketing', price: 199.99, chapters: 5, lessons: 20, duration: 1500 },
  { title: 'Investment Banking', description: 'Financial modeling and analysis', category: 'Finance', price: 399.99, chapters: 6, lessons: 18, duration: 1800 },
  
  // Health Courses - High content, low price
  { title: 'Complete Nutrition Guide', description: 'Science-based nutrition', category: 'Health', price: 49.99, chapters: 15, lessons: 60, duration: 4500 },
  { title: 'Yoga Teacher Training', description: '200-hour certification program', category: 'Health', price: 79.99, chapters: 20, lessons: 80, duration: 6000 },
  { title: 'Mental Health First Aid', description: 'Support mental wellness', category: 'Health', price: 39.99, chapters: 8, lessons: 32, duration: 2400 },
  
  // Creative Courses - Variable content and pricing
  { title: 'Music Production Pro', description: 'Create professional music', category: 'Music', price: 159.99, chapters: 7, lessons: 28, duration: 2100 },
  { title: 'Creative Writing Workshop', description: 'Fiction and non-fiction writing', category: 'Writing', price: 69.99, chapters: 6, lessons: 18, duration: 1350 },
  { title: 'Photography Masterclass', description: 'Professional photography skills', category: 'Photography', price: 119.99, chapters: 8, lessons: 32, duration: 2400 },
  
  // Free Courses - Minimal content
  { title: 'HTML Basics', description: 'Learn HTML fundamentals', category: 'Programming', price: 0, chapters: 3, lessons: 9, duration: 540 },
  { title: 'Color Theory', description: 'Understanding colors in design', category: 'Design', price: 0, chapters: 2, lessons: 6, duration: 360 },
  { title: 'Public Speaking', description: 'Overcome speaking anxiety', category: 'Communication', price: 0, chapters: 4, lessons: 12, duration: 720 }
];

async function createDiverseContent() {
  try {
    console.log('Creating diverse instructors and courses...');
    
    // Create instructors
    const instructorIds = [];
    for (const instructor of instructorProfiles) {
      const [result] = await db.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [instructor.username, instructor.email, instructor.password, instructor.role]
      );
      instructorIds.push(result.insertId);
      console.log(`Created instructor: ${instructor.username}`);
    }
    
    // Create diverse courses
    for (let i = 0; i < diverseCourses.length; i++) {
      const course = diverseCourses[i];
      const instructorId = instructorIds[i % instructorIds.length];
      
      const [courseResult] = await db.execute(
        'INSERT INTO courses (title, description, category, price, instructor_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [course.title, course.description, course.category, course.price, instructorId, 'published']
      );
      
      const courseId = courseResult.insertId;
      console.log(`Created course: ${course.title} - ${course.chapters} chapters, ${course.lessons} lessons`);
      
      // Create chapters
      for (let j = 1; j <= course.chapters; j++) {
        const [chapterResult] = await db.execute(
          'INSERT INTO chapters (course_id, title, description, order_index) VALUES (?, ?, ?, ?)',
          [courseId, `Chapter ${j}`, `Chapter ${j} content`, j]
        );
        
        const chapterId = chapterResult.insertId;
        const lessonsPerChapter = Math.ceil(course.lessons / course.chapters);
        
        // Create lessons
        for (let k = 1; k <= lessonsPerChapter && (j-1)*lessonsPerChapter + k <= course.lessons; k++) {
          const lessonDuration = Math.floor(course.duration / course.lessons);
          await db.execute(
            'INSERT INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES (?, ?, ?, ?, ?, ?)',
            [chapterId, `Lesson ${k}`, `Lesson content`, 'https://youtube.com/watch?v=example', lessonDuration, k]
          );
        }
      }
      
      // Add random enrollments and ratings
      const enrollmentCount = Math.floor(Math.random() * 50) + 10;
      for (let e = 0; e < enrollmentCount; e++) {
        const randomUserId = Math.floor(Math.random() * 5) + 8; // Use created student profiles
        try {
          await db.execute(
            'INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?, ?, NOW())',
            [randomUserId, courseId]
          );
          
          const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
          await db.execute(
            'INSERT INTO course_ratings (user_id, course_id, rating, review) VALUES (?, ?, ?, ?)',
            [randomUserId, courseId, rating, 'Great course!']
          );
        } catch (err) {
          // Skip duplicate enrollments
        }
      }
    }
    
    console.log('✅ Diverse content created successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createDiverseContent();