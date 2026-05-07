# Lesson Creation Error - Troubleshooting Guide

## Quick Fixes

### 1. Check if Backend Server is Running
```bash
cd backend
npm start
```
The server should show: "Server running on port 5000"

### 2. Verify Database Connection
Run the debug script:
```bash
cd backend
node debug-lesson.js
```

### 3. Test API Endpoint
```bash
cd backend
node test-api.js
```

## Common Issues and Solutions

### Issue 1: "No token provided" Error
**Cause**: User not logged in or token expired
**Solution**: 
1. Login again in the frontend
2. Check if token exists in localStorage (F12 → Application → Local Storage)

### Issue 2: "Chapter not found" Error
**Cause**: Invalid chapter ID or chapter doesn't exist
**Solution**:
1. Ensure you're creating lessons for an existing chapter
2. Create a chapter first before adding lessons

### Issue 3: "Network Error" or "Failed to fetch"
**Cause**: Backend server not running or CORS issues
**Solution**:
1. Start backend server: `cd backend && npm start`
2. Check if server is running on http://localhost:5000
3. Verify CORS is enabled in server.js

### Issue 4: Database Connection Error
**Cause**: MySQL not running or wrong credentials
**Solution**:
1. Start MySQL service (XAMPP/WAMP)
2. Check database credentials in backend/.env
3. Ensure database 'lms_database' exists

## Step-by-Step Debugging

1. **Check Browser Console** (F12)
   - Look for error messages
   - Check Network tab for failed requests

2. **Check Backend Logs**
   - Look at terminal where backend is running
   - Check for error messages

3. **Verify Authentication**
   - Ensure user is logged in
   - Check if token is being sent in requests

4. **Test Database**
   - Run debug-lesson.js script
   - Check if tables exist and have correct structure

## Manual Database Check

Connect to MySQL and run:
```sql
USE lms_database;
SHOW TABLES;
DESCRIBE lessons;
SELECT * FROM chapters LIMIT 5;
```

## If All Else Fails

1. Restart both frontend and backend servers
2. Clear browser cache and localStorage
3. Re-import database schema
4. Check if all npm packages are installed:
   ```bash
   cd backend && npm install
   cd ../client && npm install
   ```