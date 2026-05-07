import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import Footer from '../../components/student/Footer';
import PaymentModal from '../../components/PaymentModal';
import ChapterLessons from '../../components/ChapterLessons';
import CourseRecommendations from '../../components/CourseRecommendationsNew';
import { useAuth } from '../../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courseData, setCourseData] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => {
    fetchCourseData();
    checkEnrollment();
  }, [id]);

  const fetchCourseData = async () => {
    try {
      const [courseResponse, chaptersResponse] = await Promise.all([
        API.get(`/courses/${id}`),
        API.get(`/chapters/course/${id}`)
      ]);
      
      setCourseData(courseResponse.data);
      setChapters(chaptersResponse.data);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!user) return;
    
    try {
      const response = await API.get('/student/enrollments');
      const enrolled = response.data.some(course => course.id === parseInt(id));
      setIsEnrolled(enrolled);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
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

    // For paid courses, show payment modal
    if (courseData.price > 0) {
      setShowPayment(true);
      return;
    }

    // For free courses, enroll directly
    setEnrolling(true);
    try {
      await API.post('/student/enroll', { courseId: id });
      setIsEnrolled(true);
      alert('Successfully enrolled in the course!');
    } catch (error) {
      console.error('Error enrolling:', error);
      if (error.response?.status === 403) {
        alert('Only students can enroll in courses');
      } else {
        alert(error.response?.data?.message || 'Failed to enroll in course');
      }
    } finally {
      setEnrolling(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setIsEnrolled(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading course details...</div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Course not found</div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {courseData.title}
              </h1>
              <p className="text-gray-600 text-lg mb-4">
                {courseData.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>By {courseData.instructor_name}</span>
                <span>•</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {courseData.category}
                </span>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-md p-6 course-content">
              <h2 className="text-2xl font-semibold mb-4">Course Content</h2>
              {chapters.length === 0 ? (
                <p className="text-gray-600">No chapters available yet.</p>
              ) : (
                <div className="space-y-4">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">
                        Chapter {index + 1}: {chapter.title}
                      </h3>
                      {chapter.description && (
                        <p className="text-gray-600 mb-3">{chapter.description}</p>
                      )}
                      
                      {/* Show lessons if enrolled OR if it's a free course */}
                      {(isEnrolled || courseData.price === 0) && (
                        <ChapterLessons chapterId={chapter.id} />
                      )}
                      
                      {!isEnrolled && courseData.price > 0 && (
                        <p className="text-sm text-gray-500 italic">
                          Enroll to see lessons
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              {/* Course Image Placeholder */}
              <div className="w-full h-48 bg-gray-200 rounded-lg mb-6 flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {courseData.price > 0 ? (
                  <div className="text-3xl font-bold text-gray-900">
                    रु{parseFloat(courseData.price).toFixed(2)}
                  </div>
                ) : (
                  <div className="text-3xl font-bold text-green-600">
                    Free
                  </div>
                )}
              </div>

              {/* Enroll Button - Only show for students */}
              {user?.role === 'student' ? (
                <>
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling || isEnrolled}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                      isEnrolled
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : enrolling
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : courseData.price > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {isEnrolled
                      ? 'Enrolled ✓'
                      : enrolling
                      ? 'Enrolling...'
                      : courseData.price > 0
                      ? `Buy Now - रु${parseFloat(courseData.price).toFixed(2)}`
                      : 'Start Learning'
                    }
                  </button>
                  
                  {/* Continue Learning Button for Enrolled Students */}
                  {isEnrolled && (
                    <button
                      onClick={() => {
                        document.querySelector('.course-content')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full mt-3 py-3 px-4 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Continue Learning
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full py-3 px-4 text-center text-gray-500 bg-gray-100 rounded-lg">
                  {user?.role === 'educator' ? 'Course Management Only' : 'Students Only'}
                </div>
              )}

              {/* Course Info */}
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Chapters:</span>
                  <span>{chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Level:</span>
                  <span className="capitalize">{courseData.level || 'All Levels'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">{courseData.status}</span>
                </div>
              </div>

              {/* What's Included */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">What's included:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Lifetime access
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Mobile and desktop access
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Progress tracking
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommendations Section */}
        <div className="mt-12 space-y-8">
          <CourseRecommendations 
            courseId={id} 
            title="Recommendations" 
          />
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPayment && (
        <PaymentModal
          course={courseData}
          onClose={() => setShowPayment(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
      
      <Footer />
    </>
  );
};

export default CourseDetails;