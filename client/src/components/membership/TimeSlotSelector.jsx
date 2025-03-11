import React from 'react';

const TimeSlotSelector = ({ capacityData, onSelectTimeSlot, selectedTimeSlot }) => {
  // Common time slots
  const timeSlots = [
    { id: 'morning', label: 'Morning (6am - 12pm)', icon: '☀️' },
    { id: 'afternoon', label: 'Afternoon (12pm - 5pm)', icon: '🌤️' },
    { id: 'evening', label: 'Evening (5pm - 10pm)', icon: '🌙' },
    { id: 'night', label: 'Late Night (10pm - 6am)', icon: '🌚' }
  ];

  // Get capacity status and styling
  const getCapacityStatus = (slotId) => {
    if (!capacityData) return { text: 'Loading...', color: 'bg-gray-300' };
    
    const status = capacityData[slotId];
    
    switch (status) {
      case 'free':
        return { 
          text: 'Not Busy', 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: '✅'
        };
      case 'moderately busy':
        return { 
          text: 'Moderately Busy', 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: '⚠️'
        };
      case 'busy':
        return { 
          text: 'Busy', 
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: '⚠️'
        };
      case 'full':
        return { 
          text: 'At Capacity', 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: '❗'
        };
      default:
        return { 
          text: 'Unknown', 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: '❓'
        };
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {timeSlots.map((slot) => {
          const capacityInfo = getCapacityStatus(slot.id);
          const isSelected = selectedTimeSlot === slot.id;
          
          return (
            <div 
              key={slot.id}
              onClick={() => onSelectTimeSlot(slot.id)}
              className={`
                border rounded-lg p-4 cursor-pointer transition-transform duration-200
                ${isSelected ? 'border-blue-500 ring-2 ring-blue-500 transform scale-105' : 'border-gray-200 hover:border-blue-300'}
              `}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{slot.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{slot.label}</h3>
                    <div className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${capacityInfo.color}`}>
                      {capacityInfo.icon} {capacityInfo.text}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {isSelected && (
                    <div className="h-6 w-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              
              {capacityInfo.text === 'At Capacity' && (
                <p className="mt-2 text-sm text-red-600">
                  This time slot is currently at full capacity. You can still select it, but expect the gym to be crowded.
                </p>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 flex items-center">
          <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Gym Capacity Information
        </h3>
        <p className="mt-1 text-sm text-blue-700">
          The capacity indicator shows the typical gym occupancy during these hours. You can visit anytime during your membership hours, but selecting a preferred time helps us manage gym traffic.
        </p>
      </div>
    </div>
  );
};

export default TimeSlotSelector;