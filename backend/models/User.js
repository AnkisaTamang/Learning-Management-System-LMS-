const db = require('../config/database');

class User {
  static async create(userData) {
    const { username, email, password, role } = userData;
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
      [username, email, password, role]
    );
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }

  static async getAll() {
    const [rows] = await db.execute('SELECT id, username, email, role, created_at FROM users');
    return rows;
  }

  static async updateRole(userId, role) {
    await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, userId]);
  }
}

module.exports = User;