import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../api/api';
import LessonManagement from '../../components/LessonManagement';

const ChapterManagement = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [chapters, setChapters] = useState([]);
  const [course, setCourse] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    content: '',
    duration: '',
    order_index: 1,
    is_free: false
  });

  useEffect(() => {
    fetchCourseAndChapters();
  }, [courseId]);

  const fetchCourseAndChapters = async () => {
    try {
      const [courseRes, chaptersRes] = await Promise.all([
        API.get(`/courses/${courseId}`),
        API.get(`/chapters/course/${courseId}`)
      ]);

      setCourse(courseRes.data);
      setChapters(chaptersRes.data);
      setFormData(prev => ({ ...prev, order_index: chaptersRes.data.length + 1 }));
    } catch (error) {
      console.error('Error fetching data:', error);
      setChapters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting chapter:', {
      course_id: courseId,
      title: formData.title,
      description: formData.description,
      order_index: formData.order_index
    });
    
    try {
      const response = await API.post('/chapters', {
        course_id: courseId,
        title: formData.title,
        description: formData.description,
        order_index: formData.order_index
      });

      console.log('Chapter created:', response.data);
      setShowAddForm(false);
      setFormData({
        title: '',
        description: '',
        video_url: '',
        content: '',
        duration: '',
        order_index: chapters.length + 2,
        is_free: false
      });
      fetchCourseAndChapters();
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create chapter';
      alert('Error: ' + errorMessage);
    }
  };

  const deleteChapter = async (chapterId) => {
    if (window.confirm('Are you sure you want to delete this chapter?')) {
      try {
        await API.delete(`/chapters/${chapterId}`);
        fetchCourseAndChapters();
      } catch (error) {
        console.error('Error deleting chapter:', error);
        alert('Failed to delete chapter');
      }
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Chapters</h1>
              <p className="text-gray-600 mt-1">{course?.title}</p>
            </div>
            <button
              onClick={() => navigate('/educator/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Chapter Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {showAddForm ? 'Cancel' : 'Add New Chapter'}
          </button>
        </div>

        {/* Add Chapter Form */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Add New Chapter</h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chapter Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.video_url}
                    onChange={(e) => setFormData({...formData, video_url: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order_index}
                    onChange={(e) => setFormData({...formData, order_index: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_free"
                    checked={formData.is_free}
                    onChange={(e) => setFormData({...formData, is_free: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="is_free" className="text-sm font-medium text-gray-700">
                    Free Preview Chapter
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Chapter content, notes, or additional resources"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Chapter
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Chapters List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">Course Chapters ({chapters.length})</h3>
          </div>

          {chapters.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No chapters added yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {chapters.map((chapter, index) => (
                <div key={chapter.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded">
                          Chapter {chapter.order_index}
                        </span>
                        {chapter.is_free && (
                          <span className="bg-green-100 text-green-800 text-sm font-semibold px-2 py-1 rounded">
                            Free Preview
                          </span>
                        )}
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mt-2">{chapter.title}</h4>
                      {chapter.description && (
                        <p className="text-gray-600 mt-1">{chapter.description}</p>
                      )}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        {chapter.duration > 0 && <span>{chapter.duration} minutes</span>}
                        {chapter.video_url && <span>Has Video</span>}
                        <span>Created {new Date(chapter.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button 
                        onClick={() => {
                          setSelectedChapterId(chapter.id);
                          setShowLessonModal(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                      >
                        Manage Lessons
                      </button>
                      <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      <button
                        onClick={() => deleteChapter(chapter.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Lesson Management Modal */}
      {showLessonModal && (
        <LessonManagement 
          chapterId={selectedChapterId}
          onClose={() => {
            setShowLessonModal(false);
            setSelectedChapterId(null);
          }}
        />
      )}
    </div>
  );
};

export default ChapterManagement;