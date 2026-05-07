import React, { useEffect, useState } from "react";
import { Line } from "rc-progress";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/student/Footer";
import API from "../../api/api";

const MyEnrollments = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await API.get('/student/enrollments');
      console.log('Enrolled courses:', response.data);
      setEnrolledCourses(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      if (error.response?.status === 401) {
        alert('Please login to view your enrollments');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateCourseDuration = (course) => {
    // Placeholder calculation - you can implement based on course content
    return "2-3 hours";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading your enrollments...</div>
      </div>
    );
  }

  return (
    <>
      <div className="md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>
        
        {enrolledCourses.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">You haven't enrolled in any courses yet.</p>
            <button
              onClick={() => navigate('/course-list')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <table className="md:table-auto table-fixed w-full overflow-hidden border mt-10">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">Course</th>
                <th className="px-4 py-3 font-semibold truncate">Instructor</th>
                <th className="px-4 py-3 font-semibold truncate">Price</th>
                <th className="px-4 py-3 font-semibold truncate">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {enrolledCourses.map((course) => (
                <tr key={course.id} className="border-b border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                    <div className="w-14 sm:w-24 md:w-28 h-10 bg-gray-200 rounded flex items-center justify-center">
                      📚
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 max-sm:text-sm font-medium">{course.title}</p>
                      <p className="text-sm text-gray-600">{course.category}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">{course.instructor_name}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {course.price > 0 ? `रु${course.price}` : 'Free'}
                  </td>
                  <td className="px-4 py-3 max-sm:text-right">
                    <button 
                      className="px-3 sm:px-5 py-1.5 sm:py-2 bg-red-600 max-sm:text-xs text-white rounded hover:bg-red-700 transition"
                      onClick={() => navigate(`/course-details/${course.id}`)} 
                    >
                      Continue Learning
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer/>
    </>
  );
};

export default MyEnrollments;