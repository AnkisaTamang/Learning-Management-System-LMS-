const API = require('./api/api');

async function testPayment() {
  try {
    // Test data
    const orderData = {
      courseId: 1,
      amount: 99.99,
      courseName: 'Test Course'
    };
    
    console.log('Testing payment with:', orderData);
    
    const response = await API.post('/payment/esewa', orderData);
    console.log('Response:', response.data);
    
    if (response.data.success && response.data.formData) {
      console.log('✅ Payment endpoint working - formData received');
    } else {
      console.log('❌ Payment endpoint issue - no formData');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testPayment();