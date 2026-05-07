const db = require('./config/database');

const userProfiles = [
  {
    username: 'tech_student',
    email: 'tech@student.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'student',
    interests: ['Programming', 'Web Development', 'Database']
  },
  {
    username: 'design_lover',
    email: 'design@student.com', 
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'student',
    interests: ['Design', 'Photography']
  },
  {
    username: 'business_pro',
    email: 'business@student.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'student', 
    interests: ['Business', 'Finance', 'Marketing']
  },
  {
    username: 'health_enthusiast',
    email: 'health@student.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'student',
    interests: ['Health', 'Nutrition']
  },
  {
    username: 'language_learner',
    email: 'language@student.com',
    password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    role: 'student',
    interests: ['Language', 'Writing']
  }
];

async function createUserProfiles() {
  try {
    console.log('Creating user profiles...');
    
    for (const profile of userProfiles) {
      // Create user
      const [userResult] = await db.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [profile.username, profile.email, profile.password, profile.role]
      );
      
      const userId = userResult.insertId;
      console.log(`Created user: ${profile.username} (ID: ${userId})`);
      
      // Get courses matching user interests
      for (const interest of profile.interests) {
        const [courses] = await db.execute(
          'SELECT id FROM courses WHERE category = ? OR category LIKE ? LIMIT 3',
          [interest, `%${interest}%`]
        );
        
        // Enroll in matching courses
        for (const course of courses) {
          await db.execute(
            'INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?, ?, NOW())',
            [userId, course.id]
          );
          
          // Add ratings (4-5 stars for preferred categories)
          const rating = Math.floor(Math.random() * 2) + 4;
          await db.execute(
            'INSERT INTO course_ratings (user_id, course_id, rating, review) VALUES (?, ?, ?, ?)',
            [userId, course.id, rating, `Great ${interest.toLowerCase()} course!`]
          );
        }
      }
    }
    
    console.log('✅ User profiles created successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createUserProfiles();