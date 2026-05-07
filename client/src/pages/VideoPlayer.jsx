import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { getYouTubeEmbedUrl } from '../utils/youtube';

const VideoPlayer = () => {
  const { lessonId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { lesson, videoId } = location.state || {};

  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!lesson) {
      navigate('/');
      return;
    }
  }, [lesson, navigate]);

  const markAsCompleted = async () => {
    try {
      setCompleted(true);
      alert('Lesson marked as completed!');
    } catch (error) {
      console.error('Error marking lesson as completed:', error);
    }
  };

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(lesson.video_url, true);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition"
        >
          <span>←</span>
          <span>Back to Course</span>
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video">
                {embedUrl ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={embedUrl}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">Invalid video URL</p>
                  </div>
                )}
              </div>

              <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {lesson.title}
                </h1>
                {lesson.content && (
                  <p className="text-gray-600 mb-4">{lesson.content}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {lesson.duration > 0 && (
                      <span>Duration: {lesson.duration} minutes</span>
                    )}
                  </div>
                  
                  <button
                    onClick={markAsCompleted}
                    disabled={completed}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      completed
                        ? 'bg-green-100 text-green-800 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {completed ? '✓ Completed' : 'Mark as Complete'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Lesson Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Title</h3>
                  <p className="text-gray-600">{lesson.title}</p>
                </div>
                
                {lesson.content && (
                  <div>
                    <h3 className="font-medium text-gray-900">Description</h3>
                    <p className="text-gray-600">{lesson.content}</p>
                  </div>
                )}
                
                {lesson.duration > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900">Duration</h3>
                    <p className="text-gray-600">{lesson.duration} minutes</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;