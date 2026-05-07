import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RoleSelection from './pages/auth/RoleSelection';
import AdminLogin from './pages/auth/AdminLogin';
import EducatorLogin from './pages/auth/EducatorLogin';
import StudentLogin from './pages/auth/StudentLogin';
import EducatorRegister from './pages/auth/EducatorRegister';
import StudentRegister from './pages/auth/StudentRegister';

// Student Components
import Home from './pages/student/Home';
import StudentDashboard from './pages/student/StudentDashboard';
import CoursesList from './pages/student/CoursesList';
import CourseDetails from './pages/student/CourseDetails';
import MyEnrollments from './pages/student/MyEnrollments';
import Player from './pages/student/Player';
import SearchResults from './pages/student/SearchResults';
import CoursePlayer from './pages/CoursePlayer';
import VideoPlayer from './pages/VideoPlayer';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import Navbar from './components/student/Navbar';
import AboutUs from './pages/AboutUs';

// Educator Components
import EducatorDashboard from './pages/educator/Dashboard';
import AddCourse from './pages/educator/AddCourse';
import EditCourse from './pages/educator/EditCourse';
import ChapterManagement from './pages/educator/ChapterManagement';

// Admin Components
import AdminDashboard from './pages/admin/AdminDashboard';

import "quill/dist/quill.snow.css";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (user) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'educator') {
      return <Navigate to="/educator/dashboard" replace />;
    } else if (user.role === 'student') {
      return <Navigate to="/student/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

const AppContent = () => {
  const { user } = useAuth();

  return (
    <div className='text-default min-h-screen bg-white'>
      {/* Show navbar for all users and public pages */}
      <Navbar />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={
          <PublicRoute>
            <RoleSelection type="login" />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <RoleSelection type="register" />
          </PublicRoute>
        } />
        
        {/* Role-specific Auth Routes */}
        <Route path="/admin/login" element={
          <PublicRoute>
            <AdminLogin />
          </PublicRoute>
        } />
        <Route path="/educator/login" element={
          <PublicRoute>
            <EducatorLogin />
          </PublicRoute>
        } />
        <Route path="/student/login" element={
          <PublicRoute>
            <StudentLogin />
          </PublicRoute>
        } />
        <Route path="/educator/register" element={
          <PublicRoute>
            <EducatorRegister />
          </PublicRoute>
        } />
        <Route path="/student/register" element={
          <PublicRoute>
            <StudentRegister />
          </PublicRoute>
        } />

        {/* Student Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/student/dashboard" element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/course-list" element={<CoursesList />} />
        <Route path="/course-list/:input" element={<CoursesList />} />
        <Route path="/search-results" element={<SearchResults />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course-details/:id" element={<CourseDetails />} />
        <Route path="/my-enrollments" element={
          <ProtectedRoute allowedRoles={['student']}>
            <MyEnrollments />
          </ProtectedRoute>
        } />
        <Route path="/player/:courseId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <Player />
          </ProtectedRoute>
        } />
        <Route path="/course-player/:courseId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <CoursePlayer />
          </ProtectedRoute>
        } />
        <Route path="/video-player/:lessonId" element={
          <ProtectedRoute allowedRoles={['student']}>
            <VideoPlayer />
          </ProtectedRoute>
        } />
        
        {/* Payment Routes */}
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failure" element={<PaymentFailure />} />

        {/* Educator Routes */}
        <Route path="/educator/dashboard" element={
          <ProtectedRoute allowedRoles={['educator']}>
            <EducatorDashboard />
          </ProtectedRoute>
        } />
        <Route path="/educator/add-course" element={
          <ProtectedRoute allowedRoles={['educator']}>
            <AddCourse />
          </ProtectedRoute>
        } />
        <Route path="/educator/course/:courseId/edit" element={
          <ProtectedRoute allowedRoles={['educator']}>
            <EditCourse />
          </ProtectedRoute>
        } />
        <Route path="/educator/course/:courseId/chapters" element={
          <ProtectedRoute allowedRoles={['educator']}>
            <ChapterManagement />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;