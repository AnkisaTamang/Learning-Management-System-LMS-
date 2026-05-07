# LMS Backend - Node.js + MySQL

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MySQL Database
1. Open MySQL Workbench or phpMyAdmin
2. Run the SQL script from `database.sql` file
3. This will create:
   - Database: `lms_database`
   - Tables: users, courses, chapters, lessons, enrollments, lesson_progress
   - Default users (password for all: `password`)

### 3. Configure Environment
Update `.env` file with your MySQL credentials:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=lms_database
JWT_SECRET=your_secret_key_here
```

### 4. Start Server
```bash
npm start
# or for development with auto-reload
npm run dev
```

Server will run on: `http://localhost:5000`

## API Endpoints

### Authentication (Role-Specific)
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/educator/login` - Educator login
- `POST /api/auth/student/login` - Student login
- `POST /api/auth/educator/register` - Educator registration
- `POST /api/auth/student/register` - Student registration

### Courses
- `GET /api/courses` - Get all published courses
- `GET /api/courses/:id` - Get course by ID
- `POST /api/courses` - Create course (Educator only)

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/users` - Get all users

### Educator
- `GET /api/educator/courses` - Get educator's courses

### Student
- `POST /api/student/enroll` - Enroll in course
- `GET /api/student/enrollments` - Get enrolled courses

## Default Accounts
- **Admin**: admin@lms.com / password
- **Educator**: john@lms.com / password
- **Student**: jane@lms.com / password

## Tech Stack
- Node.js + Express
- MySQL2 (with promises)
- JWT Authentication
- bcryptjs for password hashing
- CORS enabled