import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, CreditCard, ArrowRight } from 'lucide-react';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingData = location.state || {};
  
  if (!bookingData.package) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h1 className="text-2xl font-bold mb-4">No booking information found</h1>
          <p className="mb-6">Please return to the membership page to make a selection.</p>
          <button
            onClick={() => navigate('/memberships')}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Go to Memberships
          </button>
        </div>
      </div>
    );
  }
  
  const packageColors = {
    basic: 'text-blue-500 bg-blue-50',
    premium: 'text-purple-500 bg-purple-50',
    elite: 'text-amber-500 bg-amber-50',
    custom: 'text-green-500 bg-green-50'
  };
  
  const colorClass = packageColors[bookingData.type] || packageColors.basic;
  
  const formatPayment = (option) => {
    return option === '1month' ? 'Monthly' : 
           option === '3month' ? 'Quarterly (3 months)' : 
           'Annual (12 months)';
  };
  
  const bookingNumber = `GYM-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
  
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 text-center">
            <div className={`${colorClass} p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
              <CheckCircle size={32} />
            </div>
            <h1 className="text-2xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for choosing {bookingData.package.name}. Your membership has been processed successfully.
            </p>
            
            <div className="bg-gray-50 p-5 rounded-lg mb-6">
              <div className="flex justify-between mb-3 pb-3 border-b border-gray-200">
                <span className="text-gray-600">Booking Reference:</span>
                <span className="font-semibold">{bookingNumber}</span>
              </div>
              <div className="flex items-start gap-3 mb-3 pb-3 border-b border-gray-200">
                <Calendar size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-medium">Preferred Time Slot</p>
                  <p className="text-gray-600">{bookingData.time}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard size={20} className="text-gray-500 mt-1 flex-shrink-0" />
                <div className="flex-grow">
                  <p className="font-medium">Payment Plan</p>
                  <p className="text-gray-600">{formatPayment(bookingData.payment)}</p>
                  <p className="font-bold mt-1">${bookingData.amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              An email confirmation has been sent to your registered email address with all the details.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg flex items-center justify-center"
              >
                Go to My Dashboard
                <ArrowRight size={18} className="ml-2" />
              </button>
              
              <button
                onClick={() => navigate('/')}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 px-4 rounded-lg"
              >
                Return to Homepage
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Have questions about your membership?</p>
          <button 
            onClick={() => navigate('/contact')}
            className="text-blue-500 hover:underline font-medium"
          >
            Contact our support team
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;