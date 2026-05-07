import React from 'react';
import { Link } from 'react-router-dom';

const RoleSelection = ({ type = 'login' }) => {
  const isLogin = type === 'login';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-12">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isLogin ? 'Sign In to Your Account' : 'Create Your Account'}
          </h1>
          <p className="text-gray-600 text-lg">
            Choose your role to {isLogin ? 'access' : 'join'} the platform
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Student */}
          <Link 
            to={isLogin ? '/student/login' : '/student/register'}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-blue-200"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Student</h3>
            <p className="text-gray-600 mb-6">
              Learn from expert instructors and advance your skills
            </p>
            <div className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-blue-700 transition-colors">
              {isLogin ? 'Student Sign In' : 'Join as Student'}
            </div>
          </Link>

          {/* Educator */}
          <Link 
            to={isLogin ? '/educator/login' : '/educator/register'}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-green-200"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Educator</h3>
            <p className="text-gray-600 mb-6">
              Share your knowledge and create amazing courses
            </p>
            <div className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-green-700 transition-colors">
              {isLogin ? 'Educator Sign In' : 'Join as Educator'}
            </div>
          </Link>

          {/* Admin */}
          <Link 
            to="/admin/login"
            className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border-2 border-transparent hover:border-red-200"
          >
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-red-200 transition-colors">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Admin</h3>
            <p className="text-gray-600 mb-6">
              Manage the platform and oversee all operations
            </p>
            <div className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold group-hover:bg-red-700 transition-colors">
              Admin Sign In
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link 
              to={isLogin ? '/register' : '/login'} 
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              {isLogin ? 'Create Account' : 'Sign In'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;