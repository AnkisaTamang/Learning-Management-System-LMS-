import React, { useState, useEffect } from 'react';
import API from '../api/api';

const PaymentModal = ({ course, onClose, onSuccess }) => {
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('esewa');
  const [amount, setAmount] = useState(course.price.toString());
  const [productName, setProductName] = useState(course.title);
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Generate unique transaction ID
    setTransactionId(`TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  }, []);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    setError(null);
    
    try {
      if (paymentMethod === 'esewa') {
        const response = await API.post('/payment/initiate-payment', {
          method: 'esewa',
          amount,
          productName,
          transactionId,
          courseId: course.id
        });
        
        if (response.data.esewaConfig) {
          const { esewaConfig } = response.data;
          
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

          const esewaPayload = {
            amount: response.data.amount,
            tax_amount: esewaConfig.tax_amount,
            total_amount: esewaConfig.total_amount,
            transaction_uuid: esewaConfig.transaction_uuid,
            product_code: esewaConfig.product_code,
            product_service_charge: esewaConfig.product_service_charge,
            product_delivery_charge: esewaConfig.product_delivery_charge,
            success_url: esewaConfig.success_url,
            failure_url: esewaConfig.failure_url,
            signed_field_names: esewaConfig.signed_field_names,
            signature: esewaConfig.signature
          };

          Object.entries(esewaPayload).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = String(value);
            form.appendChild(input);
          });

          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
          return;
        }
      }
      
      // Simulate other payment methods
      await new Promise(resolve => setTimeout(resolve, 2000));
      const response = await API.post('/student/enroll', { courseId: course.id });
      alert('Payment successful! You are now enrolled in the course.');
      onSuccess();
      
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message;
      setError(`Payment initiation failed: ${errorMessage}`);
      alert(`Payment failed: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Complete Payment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Course Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold">{course.title}</h3>
          <p className="text-gray-600 text-sm">{course.category}</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            रु{parseFloat(course.price).toFixed(2)}
          </p>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Payment Method</h4>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="payment"
                value="esewa"
                checked={paymentMethod === 'esewa'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              eSewa
            </label>
          </div>
        </div>

        {/* Payment Form */}
        {paymentMethod === 'esewa' && (
          <div className="mb-6 space-y-4">
            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Amount (NPR)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                min="1"
                step="0.01"
                className="w-full border rounded px-3 py-2"
                placeholder="Enter amount"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Product Name</label>
              <input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Enter product name"
                maxLength={100}
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Transaction ID</label>
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="Enter transaction ID"
                maxLength={50}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <form onSubmit={handlePayment}>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing || !amount || !productName || !transactionId}
              className={`flex-1 px-4 py-2 rounded-lg text-white font-semibold transition ${
                processing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {processing ? 'Processing...' : `Pay रु${parseFloat(amount).toFixed(2)}`}
            </button>
          </div>
        </form>

        {/* Demo Notice */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Test Mode:</strong> Using eSewa test environment for payments.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;