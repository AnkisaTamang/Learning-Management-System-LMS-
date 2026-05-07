const Course = require('../models/Course');
const db = require('../config/database');

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.getAll();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.getById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createCourse = async (req, res) => {
  try {
    const courseData = {
      ...req.body,
      instructor_id: req.user.id
    };
    const courseId = await Course.create(courseData);
    
    // Create admin notification
    try {
      await db.execute(
        'INSERT INTO admin_notifications (type, title, message, user_id, course_id) VALUES (?, ?, ?, ?, ?)',
        ['course_created', 'New Course Created', `${req.user.username || 'Educator'} created a new course: ${courseData.title}`, req.user.id, courseId]
      );
      console.log('Course notification created for:', courseData.title);
    } catch (notificationError) {
      console.error('Failed to create course notification:', notificationError);
      // Don't fail the course creation if notification fails
    }
    
    res.status(201).json({ message: 'Course created successfully', courseId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateCourse = async (req, res) => {
  try {
    await Course.update(req.params.id, req.body, req.user.id);
    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteCourse = async (req, res) => {
  try {
    await Course.delete(req.params.id, req.user.id);
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse };