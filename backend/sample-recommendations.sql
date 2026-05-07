-- Add more diverse courses for better recommendations
INSERT INTO courses (title, description, price, instructor_id, category, image_url, status) VALUES 
-- More Web Development courses
('Advanced HTML & CSS', 'Master advanced HTML5 and CSS3 techniques', 0.00, 6, 'Web development', 'https://img.youtube.com/vi/G3e-cpL7ofc/maxresdefault.jpg', 'published'),
('HTML Complete Guide', 'Complete HTML course from beginner to advanced', 19.99, 2, 'Web development', 'https://img.youtube.com/vi/UB1O30fR-EE/maxresdefault.jpg', 'published'),
('HTML5 Masterclass', 'Modern HTML5 techniques and best practices', 39.99, 4, 'Web development', 'https://img.youtube.com/vi/pQN-pnXPaVg/maxresdefault.jpg', 'published'),
('CSS Flexbox & Grid', 'Complete guide to modern CSS layouts', 29.99, 6, 'Web development', 'https://img.youtube.com/vi/JJSoEo8JSnc/maxresdefault.jpg', 'published'),
('HTML Forms Mastery', 'Create interactive and accessible forms', 0.00, 6, 'Web development', 'https://img.youtube.com/vi/fNcJuPIZ2WE/maxresdefault.jpg', 'published'),

-- Programming courses with similar names
('JavaScript Basics', 'Learn JavaScript fundamentals', 49.99, 2, 'Programming', 'https://img.youtube.com/vi/PkZNo7MFNFg/maxresdefault.jpg', 'published'),
('JavaScript Advanced', 'Advanced JavaScript concepts and patterns', 79.99, 2, 'Programming', 'https://img.youtube.com/vi/Mus_vwhTCq0/maxresdefault.jpg', 'published'),
('Python Data Science', 'Python for data analysis and visualization', 79.99, 2, 'Programming', 'https://img.youtube.com/vi/LHBE6Q9XlzI/maxresdefault.jpg', 'published'),

-- Design courses  
('Web Design Principles', 'Learn fundamental design concepts', 39.99, 4, 'Design', 'https://img.youtube.com/vi/YqQx75OPRa0/maxresdefault.jpg', 'published'),
('UI/UX for Beginners', 'Introduction to user interface design', 0.00, 4, 'Design', 'https://img.youtube.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg', 'published');

-- Add some enrollments for these courses
INSERT IGNORE INTO enrollments (user_id, course_id) VALUES 
(1, 13), (2, 13), (3, 13), -- Advanced HTML & CSS
(1, 14), (2, 14), -- HTML Complete Guide
(3, 15), -- HTML5 Masterclass
(1, 16), (3, 16), -- CSS Flexbox & Grid  
(2, 17), (3, 17), -- HTML Forms Mastery
(1, 18), (2, 18), (3, 18), -- JavaScript Basics
(2, 19), -- JavaScript Advanced
(1, 20), (2, 20), -- Python Data Science
(2, 21), (3, 21), -- Web Design Principles
(1, 22), (3, 22); -- UI/UX for Beginners

-- Add some ratings
INSERT IGNORE INTO course_ratings (course_id, user_id, rating, review) VALUES 
(13, 1, 5, 'Excellent advanced HTML course!'),
(13, 2, 4, 'Great follow-up to basic HTML'),
(14, 1, 5, 'Complete HTML guide - very thorough!'),
(15, 3, 4, 'HTML5 features explained well'),
(16, 1, 5, 'CSS Grid finally makes sense!'),
(17, 2, 5, 'Perfect for form validation'),
(18, 1, 4, 'Good JavaScript introduction'),
(19, 2, 5, 'Advanced JS concepts well explained'),
(20, 2, 5, 'Amazing data science content'),
(21, 3, 4, 'Great design principles'),
(22, 1, 5, 'Perfect UI/UX starter course');