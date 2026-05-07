import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const CourseCard = ({ course }) => {
  const [enrolling, setEnrolling] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleEnroll = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to enroll in courses');
      navigate('/login');
      return;
    }

    // Check if user is a student
    if (user.role !== 'student') {
      alert('Only students can enroll in courses');
      return;
    }

    // For paid courses, redirect to course details for payment
    if (!course.is_free) {
      navigate(`/course-details/${course.id}`);
      return;
    }

    // For free courses, enroll directly
    setEnrolling(true);
    try {
      await API.post('/student/enroll', { courseId: course.id });
      alert('Successfully enrolled in the course!');
      navigate(`/course-details/${course.id}`);
    } catch (error) {
      console.error('Error enrolling:', error);
      if (error.response?.status === 409) {
        alert('You are already enrolled in this course');
      } else if (error.response?.status === 403) {
        alert('Only students can enroll in courses');
      } else {
        alert(error.response?.data?.message || 'Failed to enroll in course');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <img key={i} src={assets.star} alt="star" className="w-3.5 h-3.5" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <img key={i} src={assets.star} alt="half-star" className="w-3.5 h-3.5 opacity-50" />
        );
      } else {
        stars.push(
          <img key={i} src={assets.star_blank} alt="empty-star" className="w-3.5 h-3.5" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg hover:shadow-lg transition-shadow duration-300 bg-white">
      {/* Course Thumbnail */}
      <Link to={`/course-details/${course.id}`} onClick={() => scrollTo(0, 0)}>
        <div className="relative">
          <img 
            className="w-full h-48 object-cover" 
            src={course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'} 
            alt={course.title}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400';
            }}
          />
          {/* Free/Paid Badge */}
          <div className="absolute top-3 left-3">
            {course.is_free ? (
              <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                FREE
              </span>
            ) : (
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                PAID
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4 text-left">
        {/* Course Title */}
        <Link to={`/course-details/${course.id}`} onClick={() => scrollTo(0, 0)}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition">
            {course.title}
          </h3>
        </Link>

        {/* Instructor */}
        <p className="text-gray-600 text-sm mb-2">
          By {course.instructor_name || 'Instructor'}
        </p>

        {/* Category */}
        {course.category && (
          <p className="text-blue-600 text-sm mb-3 font-medium">
            {course.category}
          </p>
        )}

        {/* Rating */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm font-semibold text-gray-800">
            {parseFloat(course.average_rating || 0).toFixed(1)}
          </span>
          <div className="flex">
            {renderStars(parseFloat(course.average_rating || 0))}
          </div>
          <span className="text-gray-500 text-sm">
            ({course.rating_count || 0})
          </span>
        </div>

        {/* Price and Enroll Button */}
        <div className="flex items-center justify-between">
          {course.is_free ? (
            <span className="text-2xl font-bold text-green-600">Free</span>
          ) : (
            <span className="text-2xl font-bold text-gray-900">
              रु{parseFloat(course.price).toFixed(2)}
            </span>
          )}
          
          {/* Enroll Button - Only show for students */}
          {user?.role === 'student' ? (
            <button 
              onClick={handleEnroll}
              disabled={enrolling}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                enrolling 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : course.is_free
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {enrolling 
                ? 'Enrolling...' 
                : course.is_free 
                  ? 'Start Learning' 
                  : 'View Details'
              }
            </button>
          ) : (
            <span className="px-4 py-2 text-sm text-gray-500 italic">
              {user?.role === 'educator' ? 'Your Course' : 'View Only'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;