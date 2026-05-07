import React from 'react';
import { assets } from '../../assets/assets';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const isCourseListPage = location.pathname.includes('/course-list');

  return (
    <div
      className={`flex items-center justify-between px-4 sm:px-10 md:px-14 lg:px-36 
      border-b border-gray-500 py-4 ${isCourseListPage ? 'bg-white' : 'bg-cyan-100/70'}`}
    >
      {/* LOGO */}
      <div
        onClick={() => navigate('/')}
        className='text-2xl font-bold text-blue-600 cursor-pointer'
      >
        LMS
      </div>

      {/* Desktop Menu */}
      <div className='hidden md:flex items-center gap-5 text-gray-500'>
        <div className='flex items-center gap-5'>
          <Link to='/course-list' className='hover:text-gray-700'>Courses</Link>
          <Link to='/about' className='hover:text-gray-700'>About Us</Link>
          
          {isAuthenticated && user?.role === 'student' && (
            <>
              <Link to='/student/dashboard' className='hover:text-gray-700'>Dashboard</Link>
              <Link to='/my-enrollments' className='hover:text-gray-700'>My Enrollments</Link>
            </>
          )}
          
          {isAuthenticated && user?.role === 'educator' && (
            <Link to='/educator/dashboard' className='hover:text-gray-700'>Educator Dashboard</Link>
          )}
          
          {isAuthenticated && user?.role === 'admin' && (
            <Link to='/admin/dashboard' className='hover:text-gray-700'>Admin Dashboard</Link>
          )}
        </div>

        {/* Auth */}
        {isAuthenticated ? (
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold'>
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <span className='text-gray-700 font-medium'>{user?.username}</span>
            </div>
            <button
              onClick={logout}
              className='text-red-600 hover:text-red-800 font-medium'
            >
              Logout
            </button>
          </div>
        ) : (
          <div className='flex items-center gap-3'>
            <button
              onClick={() => navigate('/login')}
              className='text-blue-600 hover:text-blue-800 font-medium'
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className='bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition'
            >
              Create Account
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      <div className='md:hidden flex items-center gap-2 sm:gap-5 text-gray-500'>
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {isAuthenticated && user?.role === 'student' && (
            <>
              <Link to='/student/dashboard' className='hover:text-gray-700 text-xs'>Dashboard</Link>
              <Link to='/my-enrollments' className='hover:text-gray-700 text-xs'>Enrollments</Link>
            </>
          )}
          
          {isAuthenticated && user?.role === 'educator' && (
            <Link to='/educator/dashboard' className='hover:text-gray-700'>Dashboard</Link>
          )}
          
          {isAuthenticated && user?.role === 'admin' && (
            <Link to='/admin/dashboard' className='hover:text-gray-700'>Admin</Link>
          )}
        </div>

        {isAuthenticated ? (
          <div className='flex items-center gap-2'>
            <div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm'>
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className='text-red-600 hover:text-red-800 text-sm'
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={() => navigate('/login')}>
            <img src={assets.user_icon} alt="User" className='w-8 h-8' />
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;