# LMS Startup Guide

## Quick Start

### 1. Start Backend Server
```bash
cd backend
npm start
```
Server will run on: http://localhost:5000

### 2. Start Frontend Server (in new terminal)
```bash
cd client
npm run dev
```
Frontend will run on: http://localhost:5173

### 3. Login Credentials

**Student Account:**
- Email: jane@lms.com
- Password: password

**Educator Account:**
- Email: john@lms.com  
- Password: password

**Admin Account:**
- Email: admin@lms.com
- Password: password

## Fixed Issues

✅ **Course Browsing**: Students can now see all published courses
✅ **Course Enrollment**: Students can enroll in free and paid courses
✅ **My Enrollments**: Students can view their enrolled courses
✅ **Course Details**: Proper course information display
✅ **API Endpoints**: All endpoints now use Node.js backend (port 5000)

## Student Features Working

1. **Browse Courses** - View all available courses with filters
2. **Course Details** - See course information and chapters
3. **Enroll in Courses** - Enroll in free courses instantly
4. **My Enrollments** - View enrolled courses and progress
5. **Course Search** - Search courses by title or category

## Troubleshooting

If you see "Network Error":
1. Make sure backend server is running on port 5000
2. Check if MySQL is running (XAMPP/WAMP)
3. Verify database connection in backend/.env

If courses don't show:
1. Check browser console for errors
2. Verify API calls in Network tab
3. Ensure database has sample courses

## Database Setup

Make sure you've imported the database schema:
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create database: lms_database
3. Import: backend/database.sql