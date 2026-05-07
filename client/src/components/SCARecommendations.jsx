import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

const SCARecommendations = ({ courseId, title = "AI-Powered Recommendations" }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [algorithm, setAlgorithm] = useState('');
  const [targetCourse, setTargetCourse] = useState(null);

  useEffect(() => {
    if (courseId) {
      fetchSCARecommendations();
    }
  }, [courseId]);

  const fetchSCARecommendations = async () => {
    try {
      const response = await API.get(`/recommendations/sca/${courseId}`);
      setRecommendations(response.data.recommendations);
      setAlgorithm(response.data.algorithm);
      setTargetCourse(response.data.target_course);
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
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p>Optimizing recommendations with SCA...</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        <p className="text-gray-600">No SCA recommendations available.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 px-3 py-1 rounded-full">
            🧮 {algorithm}
          </span>
        </div>
      </div>

      {targetCourse && (
        <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Optimizing for:</strong> {targetCourse.title}
          </p>
          <div className="flex items-center space-x-4 text-xs text-gray-600">
            <span>📚 {targetCourse.chapters} chapters</span>
            <span>📝 {targetCourse.lessons} lessons</span>
            <span>⏱️ {Math.round(targetCourse.duration / 60)} hours</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="block border rounded-lg p-4 hover:shadow-lg transition-all duration-200 hover:border-purple-300 bg-white"
          >
            {/* SCA Score Badge */}
            <div className="flex justify-between items-start mb-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                course.sca_score >= 80 ? 'bg-green-100 text-green-800' :
                course.sca_score >= 60 ? 'bg-blue-100 text-blue-800' :
                course.sca_score >= 40 ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                🧮 {course.sca_score}% SCA Match
              </span>
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
            
            <h4 className="font-semibold text-sm mb-2 line-clamp-2">{course.title}</h4>
            
            {/* Course Content Info */}
            <div className="mb-2 space-y-1">
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>📚 {course.chapter_count || 0} chapters</span>
                <span>📝 {course.lesson_count || 0} lessons</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>⏱️ {Math.round((course.total_duration || 0) / 60)} hours</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
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
                  <span className="text-purple-600">रु{parseFloat(course.price).toFixed(2)}</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SCARecommendations;