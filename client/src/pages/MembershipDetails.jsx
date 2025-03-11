import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CustomPackage from '../components/membership/CustomPackage';
import TimeSlotSelector from '../components/membership/TimeSlotSelector';
import PaymentSummary from '../components/membership/PaymentSummary';
import MembershipComparison from '../components/membership/MembershipComparison';

// Mock packages data that would normally come from your context or API
const packages = [
    {
      id: 1,
      name: 'Basic',
      price: 29.99,
      period: 'month',
      features: [
        'Access to gym equipment',
        'Locker room access',
        'Standard operating hours',
        'Fitness assessment',
        'Online workout tracking',
      ],
      popular: false,
      color: 'gray',
      description: 'Our Basic membership is perfect for beginners or those who prefer a straightforward gym experience. You\'ll have access to our complete range of equipment and essential services at an affordable price.',
    },
    {
      id: 2,
      name: 'Premium',
      price: 49.99,
      period: 'month',
      features: [
        'All Basic features',
        'Group fitness classes',
        'Extended hours access',
        'One personal training session/month',
        'Nutritional consultation',
        'Access to swimming pool',
      ],
      popular: true,
      color: 'blue',
      description: 'The Premium membership offers additional services for those looking to take their fitness journey to the next level. With group classes and personal training included, you\'ll get expert guidance along with enhanced access.',
    },
    {
      id: 3,
      name: 'Elite',
      price: 79.99,
      period: 'month',
      features: [
        'All Premium features',
        'Unlimited personal training',
        '24/7 gym access',
        'Priority class booking',
        'Complimentary towel service',
        'Guest passes (2/month)',
        'Access to all locations',
      ],
      popular: false,
      color: 'indigo',
      description: 'Our most comprehensive membership package, Elite gives you unlimited access to all our facilities and services. With round-the-clock access and unlimited personal training, this is for those who are serious about their fitness goals.',
    }
  ];
  
const MembershipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isCustom, setIsCustom] = useState(false);
  const [customPackageData, setCustomPackageData] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState('month');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [gymCapacity, setGymCapacity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/membership-details/${id}` } });
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated, navigate, id]);

  // Load package data
  useEffect(() => {
    if (id === 'custom') {
      setIsCustom(true);
      // If coming from a custom package page, we might have saved state
      const savedCustomData = localStorage.getItem('customPackageData');
      if (savedCustomData) {
        setCustomPackageData(JSON.parse(savedCustomData));
      }
    } else {
      const pkgData = packages.find(pkg => pkg.id === parseInt(id));
      if (pkgData) {
        setSelectedPackage(pkgData);
      } else {
        // Handle invalid package id
        navigate('/membership');
      }
    }
  }, [id, navigate]);

  // Mock function to get gym capacity data
  useEffect(() => {
    // This would be an API call in a real application
    const fetchGymCapacity = () => {
      // Mock data - would come from your backend
      const mockCapacityData = {
        morning: 'moderately busy',
        afternoon: 'busy',
        evening: 'full',
        night: 'free'
      };
      setGymCapacity(mockCapacityData);
    };

    fetchGymCapacity();
  }, []);

  // Handle custom package updates
  const handleCustomPackageUpdate = (data) => {
    setCustomPackageData(data);
    localStorage.setItem('customPackageData', JSON.stringify(data));
  };

  // Calculate the price based on selected duration
  const calculatePrice = () => {
    if (isCustom && customPackageData) {
      let basePrice = customPackageData.totalPrice;
      
      if (selectedDuration === 'quarter') {
        return (basePrice * 3 * 0.9).toFixed(2); // 10% discount for 3 months
      } else if (selectedDuration === 'year') {
        return (basePrice * 12 * 0.8).toFixed(2); // 20% discount for a year
      }
      
      return basePrice.toFixed(2);
    } else if (selectedPackage) {
      if (selectedDuration === 'quarter') {
        return (selectedPackage.price * 3 * 0.9).toFixed(2);
      } else if (selectedDuration === 'year') {
        return (selectedPackage.price * 12 * 0.8).toFixed(2);
      }
      
      return selectedPackage.price.toFixed(2);
    }
    
    return '0.00';
  };

  // Handle payment process
  const handleProceedToPayment = () => {
    // Here you would normally process the payment or navigate to a payment gateway
    // For now, we'll just show an alert
    alert('Proceeding to payment gateway...');
    // navigate('/payment-confirmation');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
            {isCustom ? 'Custom Membership Package' : `${selectedPackage?.name} Membership`}
          </h1>
          <p className="mt-4 text-xl text-blue-100">
            {isCustom 
              ? 'Tailor your membership to your specific needs' 
              : selectedPackage?.description}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column - Package Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className={`px-6 py-4 ${isCustom ? 'bg-purple-600' : `bg-${selectedPackage?.color}-600`} text-white`}>
                <h2 className="text-xl font-bold">
                  {isCustom ? 'Build Your Custom Package' : `${selectedPackage?.name} Membership Details`}
                </h2>
              </div>
              
              <div className="p-6">
                {isCustom ? (
                  <div>
                    <p className="text-gray-700 mb-6">
                      Create a membership that perfectly fits your fitness goals and lifestyle. Start with our base gym access and add the features you want.
                    </p>
                    <CustomPackage 
                      onUpdate={handleCustomPackageUpdate} 
                      initialData={customPackageData} 
                      showSummary={true}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="text-3xl font-bold text-gray-900">${selectedPackage?.price}</div>
                      <span className="ml-2 text-gray-500">/month</span>
                      <span className="ml-4 px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full">
                        Save up to 20% with annual plan
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-3">Included Features:</h3>
                    <ul className="space-y-3 mb-8">
                      {selectedPackage?.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="h-5 w-5 text-green-500 mt-0.5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-8 text-center">
                      <Link 
                        to="/membership-details/custom" 
                        className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-md hover:bg-purple-700 transition duration-200"
                      >
                        Build Your Own Custom Package Instead
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Time Slot Selector */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="px-6 py-4 bg-blue-600 text-white">
                <h2 className="text-xl font-bold">Choose Your Preferred Time</h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Select when you typically plan to visit the gym. This helps us manage capacity and provide you with a better experience.
                </p>
                
                <TimeSlotSelector 
                  capacityData={gymCapacity} 
                  onSelectTimeSlot={setSelectedTimeSlot} 
                  selectedTimeSlot={selectedTimeSlot}
                />
              </div>
            </div>
            
            {/* Membership Comparison (only show for non-custom packages) */}
            {!isCustom && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-800 text-white">
                  <h2 className="text-xl font-bold">Membership Comparison</h2>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-700 mb-6">
                    See how the {selectedPackage?.name} membership compares to our other offerings:
                  </p>
                  
                  <MembershipComparison 
                    packages={packages} 
                    currentPackageId={parseInt(id)} 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden sticky top-6">
              <div className="px-6 py-4 bg-gray-800 text-white">
                <h2 className="text-xl font-bold">Payment Summary</h2>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Membership Duration</h3>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="duration"
                        value="month"
                        checked={selectedDuration === 'month'}
                        onChange={() => setSelectedDuration('month')}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700">Monthly (Regular price)</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="duration"
                        value="quarter"
                        checked={selectedDuration === 'quarter'}
                        onChange={() => setSelectedDuration('quarter')}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700">3 Months (10% discount)</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="duration"
                        value="year"
                        checked={selectedDuration === 'year'}
                        onChange={() => setSelectedDuration('year')}
                        className="form-radio h-5 w-5 text-blue-600"
                      />
                      <span className="text-gray-700">Annual (20% discount)</span>
                    </label>
                  </div>
                </div>

                <PaymentSummary 
                  packageName={isCustom ? 'Custom Package' : selectedPackage?.name}
                  basePrice={isCustom ? customPackageData?.totalPrice : selectedPackage?.price}
                  totalPrice={calculatePrice()}
                  duration={selectedDuration}
                  timeSlot={selectedTimeSlot}
                />
                
                <button
                  onClick={handleProceedToPayment}
                  disabled={!selectedTimeSlot}
                  className={`w-full py-3 px-4 rounded-md text-white font-semibold text-center ${
                    selectedTimeSlot 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  } transition duration-200 mt-6`}
                >
                  {selectedTimeSlot ? 'Proceed to Payment' : 'Please Select a Time Slot'}
                </button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  By proceeding, you agree to our terms of service and cancellation policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipDetails;