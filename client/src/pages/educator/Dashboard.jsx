import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import API from '../../api/api';

const EducatorDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showStudents, setShowStudents] = useState(false);
  const [allStudents, setAllStudents] = useState([]);
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchEducatorData();
  }, [user]);

  const fetchEducatorData = async () => {
    try {
      const response = await API.get('/educator/courses');
      console.log('Educator courses data:', JSON.stringify(response.data, null, 2));
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching educator data:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllStudents = async () => {
    try {
      console.log('Fetching students...');
      const response = await API.get('/educator/students');
      console.log('Students data:', response.data);
      setAllStudents(response.data);
      setShowStudents(true);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Error loading students: ' + error.message);
    }
  };

  const deleteCourse = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await API.delete(`/courses/${courseId}`);
        fetchEducatorData();
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Educator Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link
                to="/educator/add-course"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add New Course
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Welcome, {user?.username}</span>
                <button
                  onClick={logout}
                  className="text-red-600 hover:text-red-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => document.querySelector('.courses-table')?.scrollIntoView({ behavior: 'smooth' })}>
            <h3 className="text-lg font-semibold text-gray-900">My Courses</h3>
            <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => {
            console.log('Total Students clicked');
            fetchAllStudents();
          }}>
            <h3 className="text-lg font-semibold text-gray-900">Total Students</h3>
            <p className="text-3xl font-bold text-green-600">
              {courses.reduce((total, course) => total + (parseInt(course.enrolled_count) || 0), 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => document.querySelector('.courses-table')?.scrollIntoView({ behavior: 'smooth' })}>
            <h3 className="text-lg font-semibold text-gray-900">Published Courses</h3>
            <p className="text-3xl font-bold text-purple-600">
              {courses.filter(course => course.status === 'published').length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow cursor-pointer hover:shadow-lg transition" onClick={() => document.querySelector('.courses-table')?.scrollIntoView({ behavior: 'smooth' })}>
            <h3 className="text-lg font-semibold text-gray-900">Average Rating</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {courses.length > 0 
                ? (courses.reduce((total, course) => total + (parseFloat(course.avg_rating) || 0), 0) / courses.length).toFixed(1)
                : '0.0'
              }
            </p>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white shadow rounded-lg courses-table">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h3 className="text-lg font-semibold">My Courses</h3>
            <Link
              to="/educator/add-course"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Add Course
            </Link>
          </div>

          {courses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600 mb-4">You haven't created any courses yet.</p>
              <Link
                to="/educator/add-course"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Create Your First Course
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{course.title}</div>
                          <div className="text-sm text-gray-600">{course.category}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {course.price === 0 ? (
                          <span className="text-green-600 font-semibold">Free</span>
                        ) : (
                          <span className="font-semibold">रु{course.price}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          course.status === 'published' ? 'bg-green-100 text-green-800' :
                          course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {course.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{parseInt(course.enrolled_count) || 0}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-yellow-500">★</span>
                          <span className="ml-1">{parseFloat(course.avg_rating || 0).toFixed(1)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <Link
                            to={`/educator/course/${course.id}/edit`}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            Edit
                          </Link>
                          <Link
                            to={`/educator/course/${course.id}/chapters`}
                            className="text-green-600 hover:text-green-800"
                          >
                            Chapters
                          </Link>
                          <Link
                            to={`/educator/course/${course.id}/students`}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            Students
                          </Link>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Students Modal */}
      {showStudents && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">All Students Enrolled in My Courses</h2>
              <button
                onClick={() => setShowStudents(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {allStudents.length === 0 ? (
              <p className="text-gray-600">No students enrolled yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrolled Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {allStudents.map((student, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{student.student_name}</div>
                          <div className="text-sm text-gray-600">{student.student_email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{student.course_title}</div>
                          <div className="text-sm text-gray-600">{student.course_category}</div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {new Date(student.enrolled_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EducatorDashboard;