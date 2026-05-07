const axios = require('axios');

async function testPaymentRoute() {
  try {
    // Test without auth first
    const response = await axios.post('http://localhost:5000/api/payment/initiate-payment', {
      method: 'esewa',
      amount: '100',
      productName: 'Test Course',
      transactionId: 'TEST-123',
      courseId: '1'
    });
    console.log('✅ Route exists but needs auth');
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Route exists but needs authentication');
    } else if (error.response?.status === 404) {
      console.log('❌ Route not found - 404 error');
    } else {
      console.log('Error:', error.response?.status, error.response?.data);
    }
  }
}

testPaymentRoute();