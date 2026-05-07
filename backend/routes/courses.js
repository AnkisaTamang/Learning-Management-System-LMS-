const express = require('express');
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const { auth, educatorAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', auth, educatorAuth, createCourse);
router.put('/:id', auth, educatorAuth, updateCourse);
router.delete('/:id', auth, educatorAuth, deleteCourse);

module.exports = router;