const express = require('express');
const crypto = require('crypto');
const { auth } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// eSewa payment initialization
router.post('/initiate-payment', auth, async (req, res) => {
  try {
    console.log('Payment request:', req.body);
    const { method, amount, productName, transactionId, courseId } = req.body;
    const userId = req.user.id;

    if (method !== 'esewa' || !courseId || !amount || !transactionId) {
      console.log('Missing fields:', { method, courseId, amount, transactionId });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate unique transaction UUID
    const transaction_uuid = transactionId;
    
    // Create payment record
    const [paymentResult] = await db.execute(
      'INSERT INTO payments (user_id, course_id, amount, payment_method, status, transaction_uuid, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userId, courseId, amount, 'esewa', 'pending', transaction_uuid]
    );

    const paymentId = paymentResult.insertId;
    const totalAmount = parseFloat(amount);
    const product_code = process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";

    const signedFieldNames = 'total_amount,transaction_uuid,product_code';
    const signaturePayload = `total_amount=${totalAmount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = crypto
      .createHmac('sha256', process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q')
      .update(signaturePayload)
      .digest('base64');

    const esewaConfig = {
      tax_amount: 0,
      total_amount: totalAmount,
      transaction_uuid,
      product_code,
      product_service_charge: 0,
      product_delivery_charge: 0,
      success_url: `http://localhost:5173/payment/success?paymentId=${paymentId}&userId=${userId}&courseId=${courseId}&transaction_uuid=${transaction_uuid}`,
      failure_url: `http://localhost:5173/payment/failure?paymentId=${paymentId}`,
      signed_field_names: signedFieldNames,
      signature
    };

    console.log('Payment response:', { amount: totalAmount.toString(), esewaConfig });
    res.json({ 
      amount: totalAmount.toString(),
      esewaConfig 
    });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/verify-esewa', async (req, res) => {
  try {
    const { paymentId, userId, courseId, transaction_uuid } = req.body;

    if (!paymentId || !userId || !courseId || !transaction_uuid) {
      return res.json({ success: false, message: 'Missing parameters' });
    }

    const [paymentRows] = await db.execute(
    'SELECT * FROM payments WHERE id = ?',
      [paymentId]
    );

    if (paymentRows.length === 0) {
      return res.json({ success: false, message: 'Payment record not found' });
    }

    const payment = paymentRows[0];

    // Prevent duplicate processing
    if (payment.status === 'completed') {
      return res.json({ success: true, message: 'Payment already verified' });
    }

    // Enroll if not enrolled
    const [enrollmentRows] = await db.execute(
      'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
      [userId, courseId]
    );

    if (enrollmentRows.length === 0) {
      await db.execute(
        'INSERT INTO enrollments (user_id, course_id, enrolled_at) VALUES (?, ?, NOW())',
        [userId, courseId]
      );
    }

    // Update payment
    await db.execute(
      'UPDATE payments SET status = "completed", updated_at = NOW() WHERE id = ?',
      [paymentId]
    );

    res.json({ success: true, message: 'Payment verified successfully' });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;