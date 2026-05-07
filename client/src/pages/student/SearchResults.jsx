import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../../api/api';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('query');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'relevance'
  });

  useEffect(() => {
    if (query) {
      searchCourses();
    }
  }, [query, filters]);

  const searchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        query,
        ...filters
      });
      
      console.log('Searching for:', query);
      console.log('API URL:', `/search?${params}`);
      
      const response = await API.get(`/search?${params}`);
      console.log('Search response:', response.data);
      setResults(response.data.results || []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Searching...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          Search Results for "{query}"
        </h1>
        <p className="text-gray-600">
          Found {results.length} courses
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
          className="border rounded px-3 py-2"
        >
          <option value="">All Categories</option>
          <option value="programming">Programming</option>
          <option value="design">Design</option>
          <option value="business">Business</option>
          <option value="marketing">Marketing</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
          className="border rounded px-3 py-2"
        >
          <option value="relevance">Most Relevant</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="popular">Most Popular</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No courses found for "{query}"</p>
          <p className="text-gray-500 mt-2">Try adjusting your search terms or filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((course) => (
            <Link
              key={course.id}
              to={`/course/${course.id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                  {course.description}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    by {course.instructor_name}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {course.category}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    {course.price === 0 ? 'Free' : `रु${course.price}`}
                  </span>
                  {course.search_score && (
                    <span className="text-xs text-gray-500">
                      {course.search_score}% match
                    </span>
                  )}
                </div>
                {course.enrollment_count > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {course.enrollment_count} students enrolled
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;