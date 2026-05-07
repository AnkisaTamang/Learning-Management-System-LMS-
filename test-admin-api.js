const axios = require('axios');

// Test admin endpoints
async function testAdminAPI() {
  try {
    // First login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@lms.com',
      password: 'password'
    });
    
    const token = loginResponse.data.token;
    console.log('Admin login successful, token:', token.substring(0, 20) + '...');
    
    // Test students endpoint
    const studentsResponse = await axios.get('http://localhost:5000/api/admin/students', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Students:', studentsResponse.data);
    
    // Test educators endpoint
    const educatorsResponse = await axios.get('http://localhost:5000/api/admin/educators', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Educators:', educatorsResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testAdminAPI();