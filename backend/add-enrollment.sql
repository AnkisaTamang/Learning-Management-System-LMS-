-- Check current users and their IDs
SELECT id, username, email, role FROM users;

-- Check current courses and their instructor IDs
SELECT id, title, instructor_id FROM courses;

-- Check current enrollments
SELECT * FROM enrollments;

-- Add enrollment data for the current educator's course
INSERT INTO enrollments (user_id, course_id) VALUES 
(3, 12); -- Jane Student enrolled in HTML course (id: 12)

-- Add a rating for the course
INSERT INTO course_ratings (course_id, user_id, rating, review) VALUES 
(12, 3, 5, 'Great HTML course for beginners!');