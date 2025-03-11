import React, { useState } from 'react';
import PricingCard from '../components/membership/PricingCard';
import CustomPackage from '../components/membership/CustomPackage';

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
  }
];

const Membership = () => {
  const [showCustomPackage, setShowCustomPackage] = useState(false);

  return (
    <div>
      <div className="relative bg-gray-800">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Gym interior"
          />
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Membership Options
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the membership that fits your lifestyle and fitness goals. All plans include access to our state-of-the-art facilities and expert support.
          </p>
        </div>
      </div>

      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Select Your Plan
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Find the perfect membership for your fitness journey
            </p>
          </div>

          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            {packages.map((pkg) => (
              <PricingCard key={pkg.id} pkg={pkg} />
            ))}
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900">
              Looking for something specific?
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Create your own custom package based on your needs
            </p>
            <button
              onClick={() => setShowCustomPackage(!showCustomPackage)}
              className="mt-6 px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {showCustomPackage ? 'Hide Custom Package Builder' : 'Build Your Custom Package'}
            </button>
          </div>

          {showCustomPackage && <CustomPackage />}
        </div>
      </div>

      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-500">Have questions about our memberships? Find answers to common questions below.</p>
          </div>
          <div className="mt-12 space-y-8">
            <div>
              <h3 className="text-xl font-medium text-gray-900">Can I cancel my membership at any time?</h3>
              <p className="mt-2 text-base text-gray-500">Yes, all our memberships can be canceled with a 30-day notice. There are no long-term contracts or cancellation fees.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900">Are there any joining fees?</h3>
              <p className="mt-2 text-base text-gray-500">No, we don't charge any joining fees or hidden costs. The price you see is the price you pay.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900">Can I freeze my membership?</h3>
              <p className="mt-2 text-base text-gray-500">Yes, you can freeze your membership for up to 3 months per year for medical reasons or extended travel.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900">Do you offer family discounts?</h3>
              <p className="mt-2 text-base text-gray-500">Yes, we offer a 10% discount for each additional family member who joins with you.</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900">Can I try before I buy?</h3>
              <p className="mt-2 text-base text-gray-500">Absolutely! We offer a free 1-day pass for new members to try our facilities before committing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Membership;