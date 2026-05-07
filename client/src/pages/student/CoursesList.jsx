import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/student/SearchBar';
import CourseCard from '../../components/student/CourseCard';
import { assets } from '../../assets/assets';
import Footer from '../../components/student/Footer';

const CoursesList = () => {
  const navigate = useNavigate();
  const { input } = useParams();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (allCourses.length > 0) {
      let tempCourses = allCourses.slice();

      // Apply search filter
      if (input) {
        tempCourses = tempCourses.filter(course =>
          course.title.toLowerCase().includes(input.toLowerCase()) ||
          course.category?.toLowerCase().includes(input.toLowerCase())
        );
      }

      // Apply price filter
      if (filter === 'free') {
        tempCourses = tempCourses.filter(course => course.is_free);
      } else if (filter === 'paid') {
        tempCourses = tempCourses.filter(course => !course.is_free);
      }

      setFilteredCourses(tempCourses);
    }
  }, [allCourses, input, filter]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      console.log('Fetched courses:', data);
      
      // Transform data to match expected format
      const transformedCourses = data.map(course => ({
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading courses...</div>
      </div>
    );
  }

  return (
    <>
      <div className='relative md:px-36 px-8 pt-20 text-left'>
        {/* HEADING + SEARCHBAR */}
        <div className='flex md:flex-row flex-col gap-6 items-start justify-between w-full'>
          <div>
            <h1 className='text-4xl font-semibold text-gray-800'>Course List</h1>
            <p className='text-gray-500'>
              <span 
                className='text-blue-600 cursor-pointer' 
                onClick={() => navigate('/')}>
                Home
              </span> 
              / <span>Course List</span>
            </p>
          </div>

          <SearchBar data={input} />
        </div>

        {/* FILTERS */}
        <div className='flex gap-4 mt-8 mb-4'>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Courses
          </button>
          <button
            onClick={() => setFilter('free')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'free' 
                ? 'bg-green-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Free Courses
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-4 py-2 rounded-lg transition ${
              filter === 'paid' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Paid Courses
          </button>
        </div>

        {/* SEARCH TAG */}
        {input && (
          <div className='inline-flex items-center gap-4 px-4 py-2 border mt-4 mb-8 text-gray-600 rounded'>
            <p className='capitalize text-gray-700'>Search: {input}</p>
            <img 
              src={assets.cross_icon} 
              alt="close" 
              className='cursor-pointer w-4 h-4'
              onClick={() => navigate('/course-list')}
            />
          </div>
        )}

        {/* RESULTS COUNT */}
        <div className='mb-6'>
          <p className='text-gray-600'>
            Showing {filteredCourses.length} of {allCourses.length} courses
          </p>
        </div>

        {/* COURSES GRID */}
        {filteredCourses.length === 0 ? (
          <div className='text-center py-16'>
            <p className='text-gray-600 text-lg'>No courses found matching your criteria.</p>
            {input && (
              <button
                onClick={() => navigate('/course-list')}
                className='mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition'
              >
                View All Courses
              </button>
            )}
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-6 px-2 md:p-0'>
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default CoursesList;