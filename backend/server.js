const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const chapterRoutes = require('./routes/chapters');
const adminRoutes = require('./routes/admin');
const educatorRoutes = require('./routes/educator');
const studentRoutes = require('./routes/student');
const recommendationRoutes = require('./routes/recommendations');
const paymentRoutes = require('./routes/payment');
const searchRoutes = require('./routes/search');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/chapters', chapterRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/educator', educatorRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/search', searchRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});