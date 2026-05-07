-- Add 25 sample courses for SCA algorithm testing
INSERT INTO courses (title, description, category, price, instructor_id, status, created_at) VALUES
('JavaScript Fundamentals', 'Learn the basics of JavaScript programming from scratch', 'Programming', 49.99, 2, 'published', NOW()),
('React for Beginners', 'Build modern web applications with React.js', 'Programming', 79.99, 2, 'published', NOW()),
('Node.js Backend Development', 'Create powerful backend applications with Node.js', 'Programming', 89.99, 2, 'published', NOW()),
('Python Data Science', 'Master data analysis and visualization with Python', 'Data Science', 99.99, 2, 'published', NOW()),
('Machine Learning Basics', 'Introduction to machine learning algorithms', 'Data Science', 129.99, 2, 'published', NOW()),
('Digital Marketing Mastery', 'Complete guide to digital marketing strategies', 'Marketing', 69.99, 2, 'published', NOW()),
('SEO Optimization', 'Improve your website ranking with SEO techniques', 'Marketing', 39.99, 2, 'published', NOW()),
('Graphic Design Essentials', 'Learn design principles and Adobe Creative Suite', 'Design', 59.99, 2, 'published', NOW()),
('UI/UX Design Fundamentals', 'Create user-friendly interfaces and experiences', 'Design', 89.99, 2, 'published', NOW()),
('Photography Masterclass', 'Professional photography techniques and editing', 'Photography', 79.99, 2, 'published', NOW()),
('Business Strategy', 'Develop winning business strategies and plans', 'Business', 99.99, 2, 'published', NOW()),
('Project Management', 'Master project management methodologies', 'Business', 79.99, 2, 'published', NOW()),
('Financial Planning', 'Personal and business financial management', 'Finance', 89.99, 2, 'published', NOW()),
('Cryptocurrency Trading', 'Learn to trade cryptocurrencies safely', 'Finance', 149.99, 2, 'published', NOW()),
('English Grammar', 'Master English grammar rules and usage', 'Language', 29.99, 2, 'published', NOW()),
('Spanish Conversation', 'Improve your Spanish speaking skills', 'Language', 49.99, 2, 'published', NOW()),
('Yoga for Beginners', 'Start your yoga journey with basic poses', 'Health', 39.99, 2, 'published', NOW()),
('Nutrition and Diet', 'Learn about healthy eating and meal planning', 'Health', 59.99, 2, 'published', NOW()),
('Music Theory', 'Understand the fundamentals of music theory', 'Music', 69.99, 2, 'published', NOW()),
('Guitar Lessons', 'Learn to play guitar from beginner to advanced', 'Music', 79.99, 2, 'published', NOW()),
('Creative Writing', 'Develop your writing skills and creativity', 'Writing', 49.99, 2, 'published', NOW()),
('Content Marketing', 'Create engaging content that converts', 'Marketing', 59.99, 2, 'published', NOW()),
('Excel Mastery', 'Advanced Excel formulas and data analysis', 'Business', 39.99, 2, 'published', NOW()),
('WordPress Development', 'Build custom WordPress websites', 'Programming', 69.99, 2, 'published', NOW()),
('Mobile App Design', 'Design beautiful mobile applications', 'Design', 99.99, 2, 'published', NOW());

-- Add chapters for each course (3-5 chapters per course)
INSERT INTO chapters (course_id, title, description, order_index) VALUES
-- JavaScript Fundamentals (course_id will be auto-incremented, assuming it starts from existing max + 1)
((SELECT MAX(id) FROM courses WHERE title = 'JavaScript Fundamentals'), 'Variables and Data Types', 'Learn about JavaScript variables and data types', 1),
((SELECT MAX(id) FROM courses WHERE title = 'JavaScript Fundamentals'), 'Functions and Scope', 'Understanding functions and variable scope', 2),
((SELECT MAX(id) FROM courses WHERE title = 'JavaScript Fundamentals'), 'DOM Manipulation', 'Working with the Document Object Model', 3),
((SELECT MAX(id) FROM courses WHERE title = 'JavaScript Fundamentals'), 'Events and Handlers', 'Handling user interactions', 4),

-- React for Beginners
((SELECT MAX(id) FROM courses WHERE title = 'React for Beginners'), 'React Basics', 'Introduction to React components', 1),
((SELECT MAX(id) FROM courses WHERE title = 'React for Beginners'), 'State Management', 'Managing component state', 2),
((SELECT MAX(id) FROM courses WHERE title = 'React for Beginners'), 'Props and Components', 'Component communication', 3),
((SELECT MAX(id) FROM courses WHERE title = 'React for Beginners'), 'React Hooks', 'Modern React with hooks', 4),
((SELECT MAX(id) FROM courses WHERE title = 'React for Beginners'), 'Building Projects', 'Real-world React applications', 5),

-- Node.js Backend Development
((SELECT MAX(id) FROM courses WHERE title = 'Node.js Backend Development'), 'Node.js Fundamentals', 'Getting started with Node.js', 1),
((SELECT MAX(id) FROM courses WHERE title = 'Node.js Backend Development'), 'Express.js Framework', 'Building APIs with Express', 2),
((SELECT MAX(id) FROM courses WHERE title = 'Node.js Backend Development'), 'Database Integration', 'Working with databases', 3),
((SELECT MAX(id) FROM courses WHERE title = 'Node.js Backend Development'), 'Authentication', 'User authentication and security', 4),

-- Python Data Science
((SELECT MAX(id) FROM courses WHERE title = 'Python Data Science'), 'Python Basics', 'Python programming fundamentals', 1),
((SELECT MAX(id) FROM courses WHERE title = 'Python Data Science'), 'NumPy and Pandas', 'Data manipulation libraries', 2),
((SELECT MAX(id) FROM courses WHERE title = 'Python Data Science'), 'Data Visualization', 'Creating charts and graphs', 3),
((SELECT MAX(id) FROM courses WHERE title = 'Python Data Science'), 'Statistical Analysis', 'Statistical methods in Python', 4),
((SELECT MAX(id) FROM courses WHERE title = 'Python Data Science'), 'Machine Learning', 'ML algorithms with Python', 5),

-- Digital Marketing Mastery
((SELECT MAX(id) FROM courses WHERE title = 'Digital Marketing Mastery'), 'Marketing Strategy', 'Developing marketing strategies', 1),
((SELECT MAX(id) FROM courses WHERE title = 'Digital Marketing Mastery'), 'Social Media Marketing', 'Marketing on social platforms', 2),
((SELECT MAX(id) FROM courses WHERE title = 'Digital Marketing Mastery'), 'Email Marketing', 'Effective email campaigns', 3),
((SELECT MAX(id) FROM courses WHERE title = 'Digital Marketing Mastery'), 'Analytics and Tracking', 'Measuring marketing success', 4);

-- Add lessons for some chapters (2-4 lessons per chapter)
INSERT INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES
-- JavaScript Fundamentals - Variables and Data Types chapter
((SELECT id FROM chapters WHERE title = 'Variables and Data Types' LIMIT 1), 'Introduction to Variables', 'Learn how to declare and use variables in JavaScript', 'https://www.youtube.com/watch?v=9WIJQDvt4Us', 900, 1),
((SELECT id FROM chapters WHERE title = 'Variables and Data Types' LIMIT 1), 'String Data Type', 'Working with strings in JavaScript', 'https://www.youtube.com/watch?v=HDI9inVS9G0', 720, 2),
((SELECT id FROM chapters WHERE title = 'Variables and Data Types' LIMIT 1), 'Numbers and Math', 'Numeric operations in JavaScript', 'https://www.youtube.com/watch?v=VNofjVdxzlw', 840, 3),

-- React for Beginners - React Basics chapter
((SELECT id FROM chapters WHERE title = 'React Basics' LIMIT 1), 'What is React?', 'Introduction to React library', 'https://www.youtube.com/watch?v=N3AkSS5hXMA', 600, 1),
((SELECT id FROM chapters WHERE title = 'React Basics' LIMIT 1), 'Creating Components', 'Building your first React component', 'https://www.youtube.com/watch?v=Y2hgEGPzTZY', 780, 2),
((SELECT id FROM chapters WHERE title = 'React Basics' LIMIT 1), 'JSX Syntax', 'Understanding JSX in React', 'https://www.youtube.com/watch?v=7fPXI_MnBOY', 660, 3),

-- Python Data Science - NumPy and Pandas chapter
((SELECT id FROM chapters WHERE title = 'NumPy and Pandas' LIMIT 1), 'NumPy Arrays', 'Working with NumPy arrays', 'https://www.youtube.com/watch?v=QUT1VHiLmmI', 1200, 1),
((SELECT id FROM chapters WHERE title = 'NumPy and Pandas' LIMIT 1), 'Pandas DataFrames', 'Data manipulation with Pandas', 'https://www.youtube.com/watch?v=vmEHCJofslg', 1080, 2),
((SELECT id FROM chapters WHERE title = 'NumPy and Pandas' LIMIT 1), 'Data Cleaning', 'Cleaning and preparing data', 'https://www.youtube.com/watch?v=iYie42M1ZyU', 960, 3),

-- Digital Marketing - Social Media Marketing chapter
((SELECT id FROM chapters WHERE title = 'Social Media Marketing' LIMIT 1), 'Facebook Marketing', 'Marketing strategies for Facebook', 'https://www.youtube.com/watch?v=lBP6P16sHME', 900, 1),
((SELECT id FROM chapters WHERE title = 'Social Media Marketing' LIMIT 1), 'Instagram Growth', 'Growing your Instagram presence', 'https://www.youtube.com/watch?v=SlNvmJMkzQs', 840, 2),
((SELECT id FROM chapters WHERE title = 'Social Media Marketing' LIMIT 1), 'LinkedIn for Business', 'Professional networking and marketing', 'https://www.youtube.com/watch?v=UC3xJNFZvzI', 720, 3);

-- Add some sample enrollments for testing
INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES
(3, (SELECT MAX(id)-24 FROM courses), NOW()),
(3, (SELECT MAX(id)-23 FROM courses), NOW()),
(3, (SELECT MAX(id)-22 FROM courses), NOW()),
(3, (SELECT MAX(id)-21 FROM courses), NOW()),
(3, (SELECT MAX(id)-20 FROM courses), NOW());

-- Add some sample ratings
INSERT INTO course_ratings (user_id, course_id, rating, review) VALUES
(3, (SELECT MAX(id)-24 FROM courses), 5, 'Excellent course! Very well explained.'),
(3, (SELECT MAX(id)-23 FROM courses), 4, 'Good content, learned a lot.'),
(3, (SELECT MAX(id)-22 FROM courses), 5, 'Perfect for beginners.'),
(3, (SELECT MAX(id)-21 FROM courses), 4, 'Great instructor and examples.'),
(3, (SELECT MAX(id)-20 FROM courses), 5, 'Highly recommended!');