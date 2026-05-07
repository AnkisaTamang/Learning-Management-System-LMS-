import { useState, useEffect } from 'react';
import API from '../api/api';
import { extractYouTubeVideoId } from '../utils/youtube';

const LessonManagement = ({ chapterId, onClose }) => {
  const [lessons, setLessons] = useState([]);
  const [newLesson, setNewLesson] = useState({
    title: '',
    content: '',
    video_url: '',
    duration: 0
  });

  useEffect(() => {
    fetchLessons();
  }, [chapterId]);

  const fetchLessons = async () => {
    try {
      const response = await API.get(`/chapters/${chapterId}/lessons`);
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newLesson.title.trim()) {
      alert('Please enter a lesson title');
      return;
    }
    
    try {
      console.log('=== FRONTEND LESSON SUBMISSION ===');
      console.log('Chapter ID:', chapterId);
      console.log('Lesson data:', newLesson);
      console.log('Token in localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing');
      
      const lessonData = { 
        ...newLesson, 
        order_index: lessons.length + 1,
        duration: parseInt(newLesson.duration) || 0
      };
      
      console.log('Sending lesson data:', lessonData);
      
      const response = await API.post(
        `/chapters/${chapterId}/lessons`,
        lessonData
      );
      
      console.log('✅ Lesson created successfully:', response.data);
      setNewLesson({ title: '', content: '', video_url: '', duration: 0 });
      fetchLessons();
      alert('Lesson added successfully!');
      
    } catch (error) {
      console.error('❌ Error creating lesson:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      let errorMessage = 'Failed to create lesson';
      
      if (error.response) {
        // Server responded with error status
        errorMessage = error.response.data?.message || `Server error (${error.response.status})`;
        
        if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please login again.';
          // Optionally redirect to login
        } else if (error.response.status === 404) {
          errorMessage = 'Chapter not found. Please refresh and try again.';
        }
      } else if (error.request) {
        // Network error
        errorMessage = 'Network error. Please check if the server is running.';
      }
      
      alert('Error: ' + errorMessage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Manage Lessons</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Add New Lesson Form */}
        <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add New Lesson</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Lesson Title"
              value={newLesson.title}
              onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
              className="border rounded px-3 py-2"
              required
            />
            <input
              type="url"
              placeholder="Video URL (YouTube, Vimeo, etc.)"
              value={newLesson.video_url}
              onChange={(e) => setNewLesson({...newLesson, video_url: e.target.value})}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Duration (minutes)"
              value={newLesson.duration}
              onChange={(e) => setNewLesson({...newLesson, duration: parseInt(e.target.value)})}
              className="border rounded px-3 py-2"
            />
          </div>
          <textarea
            placeholder="Lesson Content/Description"
            value={newLesson.content}
            onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
            className="w-full border rounded px-3 py-2 mt-4"
            rows="3"
          />
          <button type="submit" className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Add Lesson
          </button>
        </form>

        {/* Lessons List */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Existing Lessons</h3>
          {lessons.length === 0 ? (
            <p className="text-gray-500">No lessons added yet.</p>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold">{lesson.title}</h4>
                      {lesson.content && <p className="text-gray-600 mt-1">{lesson.content}</p>}
                      {lesson.video_url && (() => {
                        const videoId = extractYouTubeVideoId(lesson.video_url);
                        return videoId ? (
                          <div className="mt-3 aspect-video w-full max-w-md">
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={lesson.title}
                              className="w-full h-full rounded"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <a
                            href={lesson.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline mt-2 inline-block"
                          >
                            📹 View Video
                          </a>
                        );
                      })()}
                      {lesson.duration > 0 && (
                        <span className="text-sm text-gray-500 ml-4">
                          Duration: {lesson.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonManagement;