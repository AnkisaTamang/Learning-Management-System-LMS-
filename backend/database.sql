-- LMS Database Schema
CREATE DATABASE IF NOT EXISTS lms_database;
USE lms_database;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'educator', 'student') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) DEFAULT 0.00,
  instructor_id INT NOT NULL,
  category VARCHAR(100),
  image_url VARCHAR(255),
  status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Chapters table
CREATE TABLE chapters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Lessons table
CREATE TABLE lessons (
  id INT PRIMARY KEY AUTO_INCREMENT,
  chapter_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT,
  video_url VARCHAR(255),
  duration INT DEFAULT 0,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chapter_id) REFERENCES chapters(id) ON DELETE CASCADE
);

-- Enrollments table
CREATE TABLE enrollments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  progress DECIMAL(5,2) DEFAULT 0.00,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (user_id, course_id)
);

-- Progress tracking table
CREATE TABLE lesson_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  lesson_id INT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE KEY unique_progress (user_id, lesson_id)
);

-- Course ratings table
CREATE TABLE course_ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  course_id INT NOT NULL,
  user_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_rating (course_id, user_id)
);

-- Admin notifications table
CREATE TABLE admin_notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  type ENUM('user_registered', 'course_created', 'course_updated', 'enrollment', 'payment') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  user_id INT,
  course_id INT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO users (username, email, password, role) VALUES 
('Admin', 'admin@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('John Educator', 'john@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'educator'),
('Jane Student', 'jane@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'student'),
('Shyam Maharjan', 'shyam@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'educator');

-- Insert sample courses with images and videos
INSERT INTO courses (title, description, price, instructor_id, category, image_url, status) VALUES 
('React Fundamentals', 'Learn React from scratch with hands-on projects', 99.99, 2, 'Web Development', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400', 'published'),
('Node.js Backend', 'Build scalable APIs with Node.js and Express', 149.99, 2, 'Backend Development', 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400', 'published'),
('Free HTML Course', 'Learn HTML basics for free', 0.00, 2, 'Web Development', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400', 'published'),
('Python for Beginners', 'Complete Python programming course', 79.99, 2, 'Programming', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400', 'published'),
('JavaScript Mastery', 'Master JavaScript from basics to advanced', 129.99, 2, 'Web Development', 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400', 'published'),
('Database Design', 'Learn MySQL and database fundamentals', 89.99, 2, 'Database', 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400', 'published'),
('UI/UX Design', 'Create beautiful user interfaces', 199.99, 2, 'Design', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400', 'published'),
('Free CSS Course', 'Learn CSS styling for free', 0.00, 2, 'Web Development', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'published'),
('Advanced Web Development', 'Complete full-stack web development course with modern technologies', 199.99, 4, 'Web Development', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', 'published'),
('Digital Marketing Mastery', 'Learn digital marketing strategies and tools', 149.99, 4, 'Marketing', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 'published'),
('Free Programming Basics', 'Introduction to programming concepts - completely free', 0.00, 4, 'Programming', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', 'published');

-- Insert sample chapters
INSERT INTO chapters (course_id, title, description, order_index) VALUES 
(1, 'Introduction to React', 'Getting started with React basics', 1),
(1, 'Components and Props', 'Learn about React components', 2),
(1, 'State and Lifecycle', 'Managing component state', 3),
(2, 'Node.js Fundamentals', 'Understanding Node.js basics', 1),
(2, 'Express Framework', 'Building APIs with Express', 2),
(3, 'HTML Basics', 'Introduction to HTML', 1),
(3, 'HTML Forms', 'Creating interactive forms', 2),
(4, 'Python Basics', 'Variables and data types', 1),
(4, 'Control Structures', 'Loops and conditions', 2),
(9, 'Frontend Fundamentals', 'HTML, CSS, and JavaScript basics', 1),
(9, 'React Development', 'Building modern UIs with React', 2),
(9, 'Backend with Node.js', 'Server-side development', 3),
(9, 'Database Integration', 'Working with databases', 4),
(10, 'Marketing Strategy', 'Planning your digital marketing approach', 1),
(10, 'Social Media Marketing', 'Leveraging social platforms', 2),
(10, 'SEO and Content', 'Search engine optimization', 3),
(11, 'Programming Concepts', 'Basic programming principles', 1),
(11, 'Problem Solving', 'Algorithmic thinking', 2);

-- Insert sample course ratings
INSERT INTO course_ratings (course_id, user_id, rating, review) VALUES 
(1, 3, 5, 'Excellent React course!'),
(1, 1, 4, 'Very good content'),
(2, 3, 4, 'Great Node.js tutorial'),
(3, 3, 5, 'Perfect for beginners'),
(4, 3, 4, 'Good Python basics'),
(5, 3, 5, 'Amazing JavaScript course'),
(6, 3, 4, 'Solid database course'),
(7, 3, 5, 'Excellent design course'),
(8, 3, 4, 'Good CSS fundamentals'),
(9, 3, 5, 'Excellent comprehensive course by Shyam!'),
(10, 3, 4, 'Great marketing insights'),
(11, 3, 5, 'Perfect free course for beginners');

-- Insert sample lessons with videos
INSERT INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES 
(1, 'What is React?', 'Introduction to React library', 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', 15, 1),
(1, 'Setting up React', 'Create your first React app', 'https://www.youtube.com/watch?v=SqcY0GlETPk', 20, 2),
(2, 'Creating Components', 'How to create React components', 'https://www.youtube.com/watch?v=Y2hgEGPzTZY', 25, 1),
(2, 'Props in React', 'Passing data with props', 'https://www.youtube.com/watch?v=PHaECbrKgs0', 18, 2),
(3, 'useState Hook', 'Managing state in functional components', 'https://www.youtube.com/watch?v=4pO-HcG2igk', 22, 1),
(4, 'Introduction to Node.js', 'What is Node.js and why use it', 'https://www.youtube.com/watch?v=uVwtVBpw7RQ', 12, 1),
(5, 'Express Basics', 'Creating your first Express server', 'https://www.youtube.com/watch?v=L72fhGm1tfE', 30, 1),
(6, 'HTML Structure', 'Basic HTML document structure', 'https://www.youtube.com/watch?v=UB1O30fR-EE', 10, 1),
(7, 'Form Elements', 'Input fields and form validation', 'https://www.youtube.com/watch?v=fNcJuPIZ2WE', 15, 1),
(8, 'Python Variables', 'Working with variables in Python', 'https://www.youtube.com/watch?v=cQT33yu9pY8', 14, 1),
(9, 'Python Loops', 'For and while loops in Python', 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ', 18, 1),
(10, 'HTML5 Fundamentals', 'Modern HTML5 features and semantics', 'https://www.youtube.com/watch?v=UB1O30fR-EE', 25, 1),
(11, 'CSS Grid and Flexbox', 'Modern CSS layout techniques', 'https://www.youtube.com/watch?v=jV8B24rSN5o', 30, 1),
(12, 'React Hooks Deep Dive', 'Advanced React hooks and patterns', 'https://www.youtube.com/watch?v=4pO-HcG2igk', 35, 1),
(13, 'Node.js and Express', 'Building REST APIs', 'https://www.youtube.com/watch?v=L72fhGm1tfE', 40, 1),
(14, 'Database Design Patterns', 'MySQL optimization and design', 'https://www.youtube.com/watch?v=ztHopE5Wnpc', 28, 1),
(15, 'Digital Marketing Strategy', 'Creating effective marketing campaigns', 'https://www.youtube.com/watch?v=nU-IIXBWlS4', 22, 1),
(16, 'Social Media Optimization', 'Maximizing social media reach', 'https://www.youtube.com/watch?v=8yrInMTsrh4', 20, 1),
(17, 'SEO Best Practices', 'Search engine optimization techniques', 'https://www.youtube.com/watch?v=xsVTqzratPs', 25, 1),
(18, 'Programming Logic', 'Understanding algorithms and logic', 'https://www.youtube.com/watch?v=cQT33yu9pY8', 18, 1),
(19, 'Problem Solving Techniques', 'Approach to solving coding problems', 'https://www.youtube.com/watch?v=6iF8Xb7Z3wQ', 20, 1);

-- Payments table
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  course_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);