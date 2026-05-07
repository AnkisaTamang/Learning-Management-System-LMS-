import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import API from '../api/api';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    try {
      const paymentId = searchParams.get('paymentId');
      const userId = searchParams.get('userId');
      const courseId = searchParams.get('courseId');
      const transaction_uuid = searchParams.get('transaction_uuid');

      if (!paymentId || !userId || !courseId || !transaction_uuid) {
        console.error('Missing required parameters');
        setSuccess(false);
        setVerifying(false);
        
        return;
      }

      const response = await API.post('/payment/verify-esewa', {
        paymentId,
        userId,
        courseId,
        transaction_uuid
      });

      if (response.data.success) {
        setSuccess(true);
      } else {
        setSuccess(false);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      setSuccess(false);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        {success ? (
          <>
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">You have been successfully enrolled in the course.</p>
            <button
              onClick={() => navigate('/student/enrollments')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              View My Courses
            </button>
          </>
        ) : (
          <>
            <div className="text-red-500 text-6xl mb-4">✗</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
            <p className="text-gray-600 mb-6">There was an issue processing your payment.</p>
            <button
              onClick={() => navigate('/course-list')}
              className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
            >
              Back to Courses
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;