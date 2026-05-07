import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-red-500 text-6xl mb-4">✗</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
        <p className="text-gray-600 mb-6">
          Your payment could not be processed. Please try again or contact support.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/course-list')}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;