const db = require('./config/database');

async function checkAndCreatePaymentsTable() {
  try {
    // Check if payments table exists
    const [tables] = await db.execute("SHOW TABLES LIKE 'payments'");
    
    if (tables.length === 0) {
      console.log('❌ Payments table does not exist. Creating...');
      
      await db.execute(`
        CREATE TABLE payments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id INT NOT NULL,
          course_id INT NOT NULL,
          amount DECIMAL(10,2) NOT NULL,
          payment_method VARCHAR(50) NOT NULL,
          status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
          transaction_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (course_id) REFERENCES courses(id)
        )
      `);
      
      console.log('✅ Payments table created successfully');
    } else {
      console.log('✅ Payments table already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkAndCreatePaymentsTable();