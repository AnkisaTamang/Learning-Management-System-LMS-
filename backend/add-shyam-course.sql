-- Add Shyam Maharjan educator and his course
USE lms_database;

-- Insert Shyam Maharjan as educator
INSERT INTO users (username, email, password, role) VALUES 
('Shyam Maharjan', 'shyam@lms.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'educator');

-- Get the educator ID (assuming it will be 4 if this is the 4th user)
SET @shyam_id = LAST_INSERT_ID();

-- Insert Shyam's course
INSERT INTO courses (title, description, price, instructor_id, category, image_url, status) VALUES 
('Advanced Web Development', 'Complete full-stack web development course with modern technologies', 199.99, @shyam_id, 'Web Development', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400', 'published'),
('Digital Marketing Mastery', 'Learn digital marketing strategies and tools', 149.99, @shyam_id, 'Marketing', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 'published'),
('Free Programming Basics', 'Introduction to programming concepts - completely free', 0.00, @shyam_id, 'Programming', 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', 'published');

-- Get course IDs for chapters
SET @course1_id = LAST_INSERT_ID();
SET @course2_id = @course1_id + 1;
SET @course3_id = @course1_id + 2;

-- Insert chapters for Advanced Web Development
INSERT INTO chapters (course_id, title, description, order_index) VALUES 
(@course1_id, 'Frontend Fundamentals', 'HTML, CSS, and JavaScript basics', 1),
(@course1_id, 'React Development', 'Building modern UIs with React', 2),
(@course1_id, 'Backend with Node.js', 'Server-side development', 3),
(@course1_id, 'Database Integration', 'Working with databases', 4);

-- Insert chapters for Digital Marketing
INSERT INTO chapters (course_id, title, description, order_index) VALUES 
(@course2_id, 'Marketing Strategy', 'Planning your digital marketing approach', 1),
(@course2_id, 'Social Media Marketing', 'Leveraging social platforms', 2),
(@course2_id, 'SEO and Content', 'Search engine optimization', 3);

-- Insert chapters for Free Programming Basics
INSERT INTO chapters (course_id, title, description, order_index) VALUES 
(@course3_id, 'Programming Concepts', 'Basic programming principles', 1),
(@course3_id, 'Problem Solving', 'Algorithmic thinking', 2);

-- Add some ratings for Shyam's courses
INSERT INTO course_ratings (course_id, user_id, rating, review) VALUES 
(@course1_id, 3, 5, 'Excellent comprehensive course by Shyam!'),
(@course2_id, 3, 4, 'Great marketing insights'),
(@course3_id, 3, 5, 'Perfect free course for beginners');