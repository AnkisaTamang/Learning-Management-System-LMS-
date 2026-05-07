import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

const CourseRecommendations = ({ courseId, title = "Recommended Courses" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [algorithm, setAlgorithm] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchRecommendations();
    }
  }, [courseId]);

  const fetchRecommendations = async () => {
    try {
      const response = await API.get(`/recommendations/course/${courseId}`);
      setRecommendations(response.data.recommendations);
      setAlgorithm(response.data.algorithm);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
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
        <p className="text-gray-600">No recommendations available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        {algorithm && (
          <div className="text-sm text-gray-500">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
              AI Powered
            </span>
          </div>
        )}
      </div>

      {algorithm && (
        <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-800">{algorithm.name}</h4>
            <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
              🤖 AI Powered
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-3">{algorithm.description}</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {Object.entries(algorithm.weights).map(([factor, weight]) => (
              <div key={factor} className="flex items-center justify-between bg-white rounded px-2 py-1">
                <span className="text-gray-600">{factor}</span>
                <span className="font-medium text-indigo-600">{weight}</span>
              </div>
            ))}
          </div>
          
          {algorithm.total_found && (
            <div className="mt-3 text-xs text-indigo-600 font-medium">
              ✨ Found {algorithm.total_found} smart recommendations
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {recommendations.map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="block border rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:border-blue-300 bg-white"
          >
            {/* Confidence Score */}
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  course.confidence >= 80 ? 'bg-green-100 text-green-800' :
                  course.confidence >= 60 ? 'bg-blue-100 text-blue-800' :
                  course.confidence >= 40 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {course.confidence}% Match
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  course.match_reason === 'Perfect Match' ? 'bg-purple-100 text-purple-700' :
                  course.match_reason === 'Similar Title' ? 'bg-green-100 text-green-700' :
                  course.match_reason === 'Same Category' ? 'bg-blue-100 text-blue-700' :
                  course.match_reason === 'Same Instructor' ? 'bg-indigo-100 text-indigo-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {course.match_reason === 'Perfect Match' && '🎯 '}
                  {course.match_reason === 'Similar Title' && '📝 '}
                  {course.match_reason === 'Same Category' && '📚 '}
                  {course.match_reason === 'Same Instructor' && '👨‍🏫 '}
                  {course.match_reason}
                </span>
              </div>
              {course.price == 0 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                  FREE
                </span>
              )}
            </div>

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
            
            <h4 className="font-semibold text-sm mb-2 line-clamp-2 min-h-[2.5rem]">{course.title}</h4>

            
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span className="truncate">{course.instructor_name}</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                {course.category}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center text-xs text-gray-500">
                <span className="text-yellow-500">★</span>
                <span className="ml-1">{parseFloat(course.avg_rating || 0).toFixed(1)}</span>
                <span className="ml-1">({course.rating_count || 0})</span>
                <span className="ml-2 text-gray-400">•</span>
                <span className="ml-2">{course.enrollment_count || 0} students</span>
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