-- Add chapters and lessons to all courses

-- First, get all course IDs and add chapters
INSERT INTO chapters (course_id, title, description, order_index, created_at) 
SELECT 
    id as course_id,
    CONCAT('Introduction to ', title) as title,
    CONCAT('Learn the basics of ', title) as description,
    1 as order_index,
    NOW() as created_at
FROM courses 
WHERE id NOT IN (SELECT DISTINCT course_id FROM chapters);

INSERT INTO chapters (course_id, title, description, order_index, created_at) 
SELECT 
    id as course_id,
    CONCAT('Advanced ', title) as title,
    CONCAT('Deep dive into ', title) as description,
    2 as order_index,
    NOW() as created_at
FROM courses 
WHERE id NOT IN (SELECT DISTINCT course_id FROM chapters WHERE order_index = 2);

INSERT INTO chapters (course_id, title, description, order_index, created_at) 
SELECT 
    id as course_id,
    CONCAT('Practical ', title) as title,
    CONCAT('Hands-on practice with ', title) as description,
    3 as order_index,
    NOW() as created_at
FROM courses;

-- Add lessons to each chapter
INSERT INTO lessons (chapter_id, title, content, video_url, order_index, created_at)
SELECT 
    c.id as chapter_id,
    CASE 
        WHEN c.order_index = 1 THEN CONCAT('Getting Started with ', co.title)
        WHEN c.order_index = 2 THEN CONCAT('Advanced Concepts in ', co.title)
        ELSE CONCAT('Project Work - ', co.title)
    END as title,
    CASE 
        WHEN c.order_index = 1 THEN CONCAT('Welcome to ', co.title, '. In this lesson, you will learn the fundamentals.')
        WHEN c.order_index = 2 THEN CONCAT('This lesson covers advanced topics in ', co.title, '.')
        ELSE CONCAT('Apply your knowledge with practical exercises in ', co.title, '.')
    END as content,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ' as video_url,
    1 as order_index,
    NOW() as created_at
FROM chapters c
JOIN courses co ON c.course_id = co.id
WHERE c.id NOT IN (SELECT DISTINCT chapter_id FROM lessons);

INSERT INTO lessons (chapter_id, title, content, video_url, order_index, created_at)
SELECT 
    c.id as chapter_id,
    CASE 
        WHEN c.order_index = 1 THEN CONCAT('Key Concepts - ', co.title)
        WHEN c.order_index = 2 THEN CONCAT('Expert Techniques - ', co.title)
        ELSE CONCAT('Final Project - ', co.title)
    END as title,
    CASE 
        WHEN c.order_index = 1 THEN CONCAT('Learn the key concepts and terminology used in ', co.title, '.')
        WHEN c.order_index = 2 THEN CONCAT('Master expert-level techniques in ', co.title, '.')
        ELSE CONCAT('Complete your final project to demonstrate mastery of ', co.title, '.')
    END as content,
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ' as video_url,
    2 as order_index,
    NOW() as created_at
FROM chapters c
JOIN courses co ON c.course_id = co.id;