import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

const CourseRecommendations = ({ courseId, title = "Recommended Courses" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      fetchRecommendations();
    }
  }, [courseId]);

  const fetchRecommendations = async () => {
    try {
      const response = await API.get(`/recommendations/course/${courseId}`);
      setRecommendations(response.data.recommendations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching SCA recommendations:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <div className="text-center py-8">Loading recommendations...</div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600">No recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
              {course.image_url ? (
                <img
                  src={course.image_url}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  📚
                </div>
              )}
            </div>
            
            {/* SCA Score Badge */}
            {course.sca_score && (
              <div className="mb-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  course.sca_score >= 80 ? 'bg-green-100 text-green-800' :
                  course.sca_score >= 60 ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  🧮 {course.sca_score}% SCA Match
                </span>
              </div>
            )}
            
            <h4 className="font-semibold text-sm mb-2 line-clamp-2">{course.title}</h4>
            
            {/* Course Content Info */}
            <div className="mb-2 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>📚 {course.chapter_count || 0} chapters</span>
                <span>📝 {course.lesson_count || 0} lessons</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>⏱️ {Math.round((course.total_duration || 0) / 60)} hours</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {course.category}
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{parseFloat(course.avg_rating || 0).toFixed(1)}</span>
                <span className="ml-2">({course.enrollment_count || 0} students)</span>
              </div>
              
              <div className="text-sm font-semibold">
                {course.price == 0 ? (
                  <span className="text-green-600">Free</span>
                ) : (
                  <span className="text-blue-600">रु{parseFloat(course.price).toFixed(2)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CourseRecommendations;