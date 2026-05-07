import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard'
import API from '../../api/api'

const CoursesSection = () => {
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await API.get('/courses');
      const transformedCourses = response.data.map(course => ({
        ...course,
        is_free: course.price === 0 || course.price === '0.00'
      }));
      setAllCourses(transformedCourses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='py-16 md:px-40 px-8'>
      <h2 className='text-3xl font-medium text-gray-800'>Learn from the best</h2>
      <p className='text-sm md:text-base text-gray-500 mt-3'>
        Discover our top-rated courses across various categories. From coding and design to <br />
        business and wellness, our courses are crafted to deliver results.
      </p>

      {loading ? (
        <div className='text-center py-16'>
          <p className='text-gray-600'>Loading courses...</p>
        </div>
      ) : allCourses.length === 0 ? (
        <div className='text-center py-16'>
          <p className='text-gray-600'>No courses available yet.</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 px-4 md:px-0 md:my-16 my-10 gap-4'>
          {allCourses.slice(0, 4).map((course) =>
            <CourseCard key={course.id} course={course} />
          )}
        </div>
      )}

      <Link
        to={'/course-list'}
        onClick={() => scrollTo(0, 0)}
        className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded hover:bg-gray-50 transition'
      >
        Show all courses
      </Link>
    </div>
  )
}

export default CoursesSection