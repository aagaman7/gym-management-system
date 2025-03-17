import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const services = [
  { id: 'gym_access', name: 'Gym Access', basePrice: 19.99 },
  { id: 'group_classes', name: 'Group Classes', basePrice: 15.00 },
  { id: 'personal_training', name: 'Personal Training Sessions', basePrice: 30.00, options: [1, 2, 4, 8] },
  { id: 'pool_access', name: 'Swimming Pool Access', basePrice: 10.00 },
  { id: 'sauna', name: 'Sauna & Steam Room', basePrice: 8.00 },
  { id: 'nutrition', name: 'Nutrition Consultation', basePrice: 25.00, options: [1, 2, 4] },
  { id: 'extended_hours', name: 'Extended Hours Access', basePrice: 5.00 },
  { id: 'locker', name: 'Personal Locker', basePrice: 7.00 },
  { id: 'towel', name: 'Towel Service', basePrice: 4.00 },
];

const CustomPackage = () => {
  const navigate = useNavigate();
  const [selectedServices, setSelectedServices] = useState({
    gym_access: { selected: true, quantity: 1 }
  });
  const [totalPrice, setTotalPrice] = useState(0);
  
  useEffect(() => {
    calculateTotal();
  }, [selectedServices]);

  const toggleService = (serviceId) => {
    setSelectedServices(prev => {
      const newState = { ...prev };
      
      if (newState[serviceId]) {
        delete newState[serviceId];
      } else {
        const service = services.find(s => s.id === serviceId);
        newState[serviceId] = { 
          selected: true, 
          quantity: service.options ? service.options[0] : 1 
        };
      }
      
      return newState;
    });
  };

  const updateQuantity = (serviceId, quantity) => {
    setSelectedServices(prev => ({
      ...prev,
      [serviceId]: { ...prev[serviceId], quantity }
    }));
  };

  const calculateTotal = () => {
    let total = 0;
    
    Object.keys(selectedServices).forEach(serviceId => {
      const service = services.find(s => s.id === serviceId);
      const { quantity } = selectedServices[serviceId];
      total += service.basePrice * quantity;
    });
    
    setTotalPrice(total);
  };

  const handleContinueWithCustom = () => {
    if (Object.keys(selectedServices).length === 0) {
      alert('Please select at least one service');
      return;
    }
    
    // Create a list of selected services with quantities for the package details page
    const selectedFeatures = Object.keys(selectedServices).map(serviceId => {
      const service = services.find(s => s.id === serviceId);
      const { quantity } = selectedServices[serviceId];
      
      return service.options 
        ? `${service.name} (${quantity} ${quantity === 1 ? 'session' : 'sessions'})`
        : service.name;
    });
    
    // Navigate to package details page with custom package info
    navigate('/package/custom', {
      state: {
        customPackage: {
          name: 'Custom Membership',
          price: totalPrice,
          features: selectedFeatures,
          selectedServices: selectedServices
        }
      }
    });
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-lg p-8 border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Build Your Custom Package</h3>
      
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        <div>
          <h4 className="text-lg font-medium text-gray-900 mb-4">Select Your Services</h4>
          <div className="space-y-4">
            {services.map(service => (
              <div key={service.id} className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id={service.id}
                    type="checkbox"
                    checked={!!selectedServices[service.id]}
                    onChange={() => toggleService(service.id)}
                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor={service.id} className="font-medium text-gray-700">{service.name}</label>
                  <p className="text-gray-500">${service.basePrice.toFixed(2)} {service.id !== 'gym_access' && 'per month'}</p>
                  
                  {service.options && selectedServices[service.id] && (
                    <div className="mt-2">
                      <select
                        value={selectedServices[service.id].quantity}
                        onChange={(e) => updateQuantity(service.id, parseInt(e.target.value))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        {service.options.map(option => (
                          <option key={option} value={option}>
                            {option} {option === 1 ? 'session' : 'sessions'} per month
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Your Custom Package Summary</h4>
          
          {Object.keys(selectedServices).length === 0 ? (
            <p className="text-gray-500">Please select at least one service.</p>
          ) : (
            <>
              <ul className="space-y-3 mb-6">
                {Object.keys(selectedServices).map(serviceId => {
                  const service = services.find(s => s.id === serviceId);
                  const { quantity } = selectedServices[serviceId];
                  return (
                    <li key={serviceId} className="flex justify-between">
                      <span className="text-gray-700">
                        {service.name} 
                        {service.options && ` (${quantity} ${quantity === 1 ? 'session' : 'sessions'})`}
                      </span>
                      <span className="font-medium text-gray-900">${(service.basePrice * quantity).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>
              
              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total Monthly Cost:</span>
                <span className="text-lg font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={handleContinueWithCustom}
                  className="block w-full px-4 py-3 text-center rounded-md shadow bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  Continue with Custom Package
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomPackage;