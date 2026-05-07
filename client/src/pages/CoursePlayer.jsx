import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CoursePlayer = () => {
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseContent();
  }, [courseId]);

  const fetchCourseContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/student/course/${courseId}/content`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourseData(response.data);
      
      // Auto-select first lesson if available
      if (response.data.chapters.length > 0 && response.data.chapters[0].lessons.length > 0) {
        setSelectedLesson(response.data.chapters[0].lessons[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching course content:', error);
      setLoading(false);
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/student/lesson/${lessonId}/complete`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  const getVideoEmbedUrl = (url) => {
    if (!url) return null;
    
    // YouTube URL conversion
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }
    
    // YouTube short URL
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?rel=0`;
    }
    
    // Vimeo URL conversion
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    // Direct video URLs
    if (url.includes('.mp4') || url.includes('.webm') || url.includes('.ogg')) {
      return url;
    }
    
    return url; // Return as-is for other URLs
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading course content...</div>;
  }

  if (!courseData) {
    return <div className="text-center text-red-600">Error loading course content</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">{courseData.course.title}</h1>
            <p className="mt-2 opacity-90">{courseData.course.description}</p>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Video Player Section */}
            <div className="lg:w-2/3 p-6">
              {selectedLesson ? (
                <div>
                  <h2 className="text-xl font-semibold mb-4">{selectedLesson.title}</h2>
                  
                  {selectedLesson.video_url && (
                    <div className="mb-6">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden">
                        {selectedLesson.video_url.includes('.mp4') || 
                         selectedLesson.video_url.includes('.webm') || 
                         selectedLesson.video_url.includes('.ogg') ? (
                          <video
                            src={selectedLesson.video_url}
                            className="w-full h-full"
                            controls
                            title={selectedLesson.title}
                          />
                        ) : (
                          <iframe
                            src={getVideoEmbedUrl(selectedLesson.video_url)}
                            className="w-full h-full"
                            frameBorder="0"
                            allowFullScreen
                            title={selectedLesson.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          />
                        )}
                      </div>
                    </div>
                  )}
                  
                  {selectedLesson.content && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Lesson Content</h3>
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedLesson.content}</p>
                      </div>
                    </div>
                  )}
                  
                  <button
                    onClick={() => markLessonComplete(selectedLesson.id)}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                  >
                    Mark as Complete
                  </button>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-12">
                  <p>Select a lesson from the sidebar to start learning</p>
                </div>
              )}
            </div>

            {/* Sidebar - Course Content */}
            <div className="lg:w-1/3 bg-gray-50 border-l">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Course Content</h3>
                
                {courseData.chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-3 pb-2 border-b">
                      {chapter.title}
                    </h4>
                    
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      <div className="space-y-2">
                        {chapter.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => setSelectedLesson(lesson)}
                            className={`w-full text-left p-3 rounded-lg transition-colors ${
                              selectedLesson?.id === lesson.id
                                ? 'bg-blue-100 border-l-4 border-blue-600'
                                : 'hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className="text-blue-600 mr-2">
                                {lesson.video_url ? '📹' : '📄'}
                              </span>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{lesson.title}</p>
                                {lesson.duration > 0 && (
                                  <p className="text-xs text-gray-500">{lesson.duration} min</p>
                                )}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No lessons available</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePlayer;