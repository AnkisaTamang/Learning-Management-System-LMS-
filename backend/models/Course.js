const db = require('../config/database');

class Course {
  static async create(courseData) {
    const { title, description, price, instructor_id, category, image_url } = courseData;
    const [result] = await db.execute(
      'INSERT INTO courses (title, description, price, instructor_id, category, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, description, price, instructor_id, category, image_url, 'published']
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await db.execute(`
      SELECT c.*, u.username as instructor_name,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as rating_count
      FROM courses c 
      JOIN users u ON c.instructor_id = u.id 
      LEFT JOIN course_ratings r ON c.id = r.course_id
      WHERE c.status = 'published'
      GROUP BY c.id
    `);
    return rows.map(course => ({
      ...course,
      price: parseFloat(course.price),
      formatted_price: `NRS ${parseFloat(course.price)}`
    }));
  }

  static async getById(id) {
    const [rows] = await db.execute(`
      SELECT c.*, u.username as instructor_name,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.id) as rating_count
      FROM courses c 
      JOIN users u ON c.instructor_id = u.id 
      LEFT JOIN course_ratings r ON c.id = r.course_id
      WHERE c.id = ?
      GROUP BY c.id
    `, [id]);
    const course = rows[0];
    if (course) {
      course.price = parseFloat(course.price);
      course.formatted_price = `NRS ${parseFloat(course.price)}`;
    }
    return course;
  }

  static async getByInstructor(instructorId) {
    const [rows] = await db.execute(`
      SELECT c.*, 
             COUNT(e.id) as enrolled_count,
             COALESCE(AVG(r.rating), 0) as avg_rating
      FROM courses c 
      LEFT JOIN enrollments e ON c.id = e.course_id
      LEFT JOIN course_ratings r ON c.id = r.course_id
      WHERE c.instructor_id = ?
      GROUP BY c.id
      ORDER BY c.created_at DESC
    `, [instructorId]);
    return rows;
  }

  static async updateStatus(courseId, status) {
    await db.execute('UPDATE courses SET status = ? WHERE id = ?', [status, courseId]);
  }
  
  static async update(courseId, courseData, instructorId) {
    const { title, description, price, category, image_url } = courseData;
    await db.execute(
      'UPDATE courses SET title = ?, description = ?, price = ?, category = ?, image_url = ? WHERE id = ? AND instructor_id = ?',
      [title, description, price, category, image_url, courseId, instructorId]
    );
  }
  
  static async delete(courseId, instructorId) {
    await db.execute('DELETE FROM courses WHERE id = ? AND instructor_id = ?', [courseId, instructorId]);
  }
}

module.exports = Course;