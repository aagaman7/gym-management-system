import React from 'react';

const PaymentSummary = ({ packageName, basePrice, totalPrice, duration, timeSlot }) => {
  // Duration label formats
  const durationLabels = {
    month: 'Monthly',
    quarter: '3 Months',
    year: 'Annual'
  };
  
  // Time slot label formats
  const timeSlotLabels = {
    morning: 'Morning (6am - 12pm)',
    afternoon: 'Afternoon (12pm - 5pm)',
    evening: 'Evening (5pm - 10pm)',
    night: 'Late Night (10pm - 6am)'
  };
  
  // Calculate original price (before discount)
  const getOriginalPrice = () => {
    if (duration === 'quarter') {
      return (basePrice * 3).toFixed(2);
    } else if (duration === 'year') {
      return (basePrice * 12).toFixed(2);
    }
    return basePrice?.toFixed(2);
  };
  
  // Calculate savings
  const calculateSavings = () => {
    const original = parseFloat(getOriginalPrice());
    const discounted = parseFloat(totalPrice);
    return (original - discounted).toFixed(2);
  };
  
  // Determine if there are savings
  const hasSavings = duration !== 'month';

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Order Summary</h3>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Package:</span>
          <span className="font-medium">{packageName}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Duration:</span>
          <span className="font-medium">{durationLabels[duration]}</span>
        </div>
        
        {timeSlot && (
          <div className="flex justify-between">
            <span className="text-gray-600">Preferred Time:</span>
            <span className="font-medium">{timeSlotLabels[timeSlot]}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Base Price:</span>
            <span className="font-medium">${basePrice?.toFixed(2)}/month</span>
          </div>
          
          {hasSavings && (
            <>
              <div className="flex justify-between mt-2">
                <span className="text-gray-600">Original Total:</span>
                <span className="font-medium">${getOriginalPrice()}</span>
              </div>
              
              <div className="flex justify-between mt-2 text-green-600">
                <span>Your Savings:</span>
                <span className="font-bold">-${calculateSavings()}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between mt-4 text-lg font-bold">
            <span>Total:</span>
            <span>${totalPrice}</span>
          </div>
          
          {duration === 'month' && (
            <p className="text-sm text-gray-500 mt-2">
              Billed monthly. Cancel anytime.
            </p>
          )}
          
          {duration === 'quarter' && (
            <p className="text-sm text-gray-500 mt-2">
              Billed every 3 months. 10% savings applied.
            </p>
          )}
          
          {duration === 'year' && (
            <p className="text-sm text-gray-500 mt-2">
              Billed annually. 20% savings applied.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;