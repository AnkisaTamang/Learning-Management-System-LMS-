import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [educators, setEducators] = useState([]);
  const [courses, setCourses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    console.log('Current user:', user);
    if (user?.role !== 'admin') {
      console.error('User is not admin:', user?.role);
      return;
    }
    fetchData();
    // Auto-refresh every 30 seconds to show new registrations and courses
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const fetchData = async () => {
    try {
      console.log('Starting to fetch admin data...');
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      const [studentsRes, educatorsRes, coursesRes, notificationsRes] = await Promise.all([
        API.get('/admin/students').catch(err => {
          console.error('Students API error:', err.response?.data || err.message);
          throw err;
        }),
        API.get('/admin/educators').catch(err => {
          console.error('Educators API error:', err.response?.data || err.message);
          throw err;
        }),
        API.get('/admin/courses').catch(err => {
          console.error('Courses API error:', err.response?.data || err.message);
          throw err;
        }),
        API.get('/admin/notifications').catch(err => {
          console.error('Notifications API error:', err.response?.data || err.message);
          throw err;
        })
      ]);
      
      console.log('API responses received:', {
        students: studentsRes.data.length,
        educators: educatorsRes.data.length,
        courses: coursesRes.data.length,
        notifications: notificationsRes.data.length
      });
      
      setStudents(studentsRes.data);
      setEducators(educatorsRes.data);
      setCourses(coursesRes.data);
      setNotifications(notificationsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId, userType) => {
    if (window.confirm(`Are you sure you want to delete this ${userType}?`)) {
      try {
        await API.delete(`/admin/user/${userId}`);
        fetchData();
        alert(`${userType} deleted successfully`);
      } catch (error) {
        alert('Error deleting user');
      }
    }
  };

  const updateCourseStatus = async (courseId, status) => {
    try {
      await API.put('/admin/course-status', { course_id: courseId, status });
      fetchData();
      alert('Course status updated');
    } catch (error) {
      alert('Error updating course status');
    }
  };

  const updateUserRole = async (userId, role) => {
    try {
      await API.put('/admin/user-role', { user_id: userId, role });
      fetchData();
      alert('User role updated');
    } catch (error) {
      alert('Error updating user role');
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={() => {
              setError(null);
              fetchData();
            }}
            className="ml-4 bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="p-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  const unreadNotifications = notifications.filter(n => !n.is_read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={fetchData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Refresh
            </button>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-sm">
              {unreadNotifications} new
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['dashboard', 'students', 'educators', 'courses', 'notifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                  {tab === 'notifications' && unreadNotifications > 0 && (
                    <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Students</h3>
                <p className="text-3xl font-bold text-blue-600">{students.length}</p>
                <p className="text-sm text-gray-600">Total registered</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Educators</h3>
                <p className="text-3xl font-bold text-green-600">{educators.length}</p>
                <p className="text-sm text-gray-600">Active instructors</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
                <p className="text-3xl font-bold text-purple-600">{courses.length}</p>
                <p className="text-sm text-gray-600">Total created</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
                <p className="text-3xl font-bold text-green-600">
                  NRS {students.reduce((sum, s) => sum + parseFloat(s.total_spent || 0), 0).toFixed(2)}
                </p>
                <p className="text-sm text-gray-600">Total earnings</p>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {notifications.slice(0, 10).map((notification) => (
                  <div key={notification.id} className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.type === 'user_registered' ? 'bg-blue-500' :
                        notification.type === 'course_created' ? 'bg-green-500' :
                        notification.type === 'enrollment' ? 'bg-purple-500' :
                        notification.type === 'payment' ? 'bg-yellow-500' :
                        'bg-gray-500'
                      }`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {notification.type.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Students ({students.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {students.map((student) => (
                    <tr key={student.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {student.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {student.enrolled_courses || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                        NRS {parseFloat(student.total_spent || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <select
                          value="student"
                          onChange={(e) => updateUserRole(student.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="student">Student</option>
                          <option value="educator">Educator</option>
                        </select>
                        <button
                          onClick={() => deleteUser(student.id, 'student')}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Educators Tab */}
        {activeTab === 'educators' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Educators ({educators.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Educator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Courses</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Students</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {educators.map((educator) => (
                    <tr key={educator.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {educator.username}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {educator.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {educator.total_courses || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {educator.total_students || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                        NRS {parseFloat(educator.total_revenue || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <select
                          value="educator"
                          onChange={(e) => updateUserRole(educator.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="educator">Educator</option>
                          <option value="student">Student</option>
                        </select>
                        <button
                          onClick={() => deleteUser(educator.id, 'educator')}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Courses ({courses.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instructor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Enrolled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-600">{course.category}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{course.instructor_name}</td>
                      <td className="px-6 py-4">
                        {course.price > 0 ? `NRS ${parseFloat(course.price).toFixed(2)}` : 'Free'}
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={course.status}
                          onChange={(e) => updateCourseStatus(course.id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">{course.enrolled_count || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div key={notification.id} className={`p-4 ${!notification.is_read ? 'bg-blue-50' : ''}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs">New</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;