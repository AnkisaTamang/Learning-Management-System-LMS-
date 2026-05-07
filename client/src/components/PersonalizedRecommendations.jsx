import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/api';

const PersonalizedRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [algorithm, setAlgorithm] = useState(null);

  useEffect(() => {
    fetchPersonalizedRecommendations();
  }, []);

  const fetchPersonalizedRecommendations = async () => {
    try {
      const response = await API.get('/recommendations/personalized');
      setRecommendations(response.data.recommendations);
      setAlgorithm(response.data.algorithm);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching personalized recommendations:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recommended for You</h3>
        <div className="text-center py-8">Loading personalized recommendations...</div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-xl font-semibold mb-4">Recommended for You</h3>
        <p className="text-gray-600">Start learning to get personalized recommendations!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Recommended for You</h3>
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
          🎯 Personalized
        </span>
      </div>

      {algorithm && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100">
          <p className="text-sm text-gray-700 mb-2">{algorithm.description}</p>
          <div className="text-xs text-gray-600">
            <strong>Based on:</strong> {algorithm.factors.join(' • ')}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.slice(0, 6).map((course) => (
          <Link
            key={course.id}
            to={`/course/${course.id}`}
            className="block border rounded-lg p-4 hover:shadow-md transition-shadow hover:border-purple-200"
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
            
            <h4 className="font-semibold text-sm mb-2 line-clamp-2">{course.title}</h4>
            
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>{course.instructor_name}</span>
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                {course.category}
              </span>
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
                  <span className="text-purple-600">रु{course.price}</span>
                )}
              </div>
            </div>
            
            {course.relevance_score > 2 && (
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                  🔥 Highly Recommended
                </span>
              </div>
            )}
          </Link>
        ))}
      </div>
      
      {recommendations.length > 6 && (
        <div className="mt-4 text-center">
          <Link
            to="/course-list"
            className="text-purple-600 hover:text-purple-800 text-sm font-medium"
          >
            View All Recommendations →
          </Link>
        </div>
      )}
    </div>
  );
};

export default PersonalizedRecommendations;