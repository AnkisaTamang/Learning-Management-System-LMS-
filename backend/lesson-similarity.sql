-- Add lessons for the HTML course (course_id = 12) and similar courses
-- First, add chapters for course 12 if they don't exist
INSERT IGNORE INTO chapters (course_id, title, description, order_index) VALUES 
(12, 'HTML Basics', 'Introduction to HTML fundamentals', 1),
(12, 'HTML Elements', 'Working with HTML elements and tags', 2);

-- Add lessons for HTML course (course_id = 12)
INSERT IGNORE INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES 
-- Assuming chapter IDs start from where we left off
((SELECT id FROM chapters WHERE course_id = 12 AND title = 'HTML Basics'), 'HTML Introduction', 'Learn what HTML is and how it works', 'https://www.youtube.com/watch?v=UB1O30fR-EE', 15, 1),
((SELECT id FROM chapters WHERE course_id = 12 AND title = 'HTML Basics'), 'HTML Structure', 'Understanding HTML document structure', 'https://www.youtube.com/watch?v=salY_Sm6mv4', 20, 2),
((SELECT id FROM chapters WHERE course_id = 12 AND title = 'HTML Elements'), 'HTML Tags', 'Working with HTML tags and attributes', 'https://www.youtube.com/watch?v=88PXJAA6szs', 18, 1),
((SELECT id FROM chapters WHERE course_id = 12 AND title = 'HTML Elements'), 'HTML Forms', 'Creating forms in HTML', 'https://www.youtube.com/watch?v=fNcJuPIZ2WE', 25, 2);

-- Add chapters and lessons for other HTML-related courses to create similarity
-- For Advanced HTML & CSS course (assuming course_id = 13)
INSERT IGNORE INTO chapters (course_id, title, description, order_index) VALUES 
(13, 'Advanced HTML', 'Advanced HTML techniques', 1),
(13, 'CSS Styling', 'Advanced CSS concepts', 2);

INSERT IGNORE INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES 
((SELECT id FROM chapters WHERE course_id = 13 AND title = 'Advanced HTML'), 'HTML5 Features', 'Modern HTML5 elements and APIs', 'https://www.youtube.com/watch?v=pQN-pnXPaVg', 22, 1),
((SELECT id FROM chapters WHERE course_id = 13 AND title = 'Advanced HTML'), 'HTML Structure Best Practices', 'Semantic HTML and accessibility', 'https://www.youtube.com/watch?v=qz0aGYrrlhU', 20, 2),
((SELECT id FROM chapters WHERE course_id = 13 AND title = 'CSS Styling'), 'CSS Introduction', 'CSS fundamentals and syntax', 'https://www.youtube.com/watch?v=1PnVor36_40', 18, 1);

-- For HTML Complete Guide course (assuming course_id = 14)
INSERT IGNORE INTO chapters (course_id, title, description, order_index) VALUES 
(14, 'HTML Fundamentals', 'Complete HTML basics', 1);

INSERT IGNORE INTO lessons (chapter_id, title, content, video_url, duration, order_index) VALUES 
((SELECT id FROM chapters WHERE course_id = 14 AND title = 'HTML Fundamentals'), 'HTML Introduction Guide', 'Complete introduction to HTML', 'https://www.youtube.com/watch?v=UB1O30fR-EE', 30, 1),
((SELECT id FROM chapters WHERE course_id = 14 AND title = 'HTML Fundamentals'), 'HTML Tags and Elements', 'Working with HTML tags', 'https://www.youtube.com/watch?v=88PXJAA6szs', 25, 2);