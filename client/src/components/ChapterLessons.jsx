import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/api';
import { extractYouTubeVideoId } from '../utils/youtube';

const ChapterLessons = ({ chapterId }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLessons();
  }, [chapterId]);

  const fetchLessons = async () => {
    try {
      const response = await API.get(`/chapters/${chapterId}/lessons`);
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWatchVideo = (lesson) => {
    if (lesson.video_url) {
      const videoId = extractYouTubeVideoId(lesson.video_url);
      if (videoId) {
        navigate(`/video-player/${lesson.id}`, { 
          state: { 
            lesson,
            videoId 
          } 
        });
      } else {
        alert('Invalid YouTube URL');
      }
    }
  };

  if (loading) {
    return <div className="text-sm text-gray-500">Loading lessons...</div>;
  }

  if (lessons.length === 0) {
    return <div className="text-sm text-gray-500">No lessons available</div>;
  }

  return (
    <div className="mt-3 space-y-2">
      {lessons.map((lesson, index) => (
        <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-500">
              {index + 1}.
            </span>
            <div>
              <h4 className="font-medium text-gray-900">{lesson.title}</h4>
              {lesson.content && (
                <p className="text-sm text-gray-600">{lesson.content}</p>
              )}
              {lesson.duration > 0 && (
                <span className="text-xs text-gray-500">{lesson.duration} min</span>
              )}
            </div>
          </div>
          
          {lesson.video_url ? (
            <button
              onClick={() => handleWatchVideo(lesson)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition"
            >
              <span>▶</span>
              <span>Watch</span>
            </button>
          ) : (
            <span className="text-xs text-gray-500">No video</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChapterLessons;