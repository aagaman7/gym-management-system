// src/components/membership/MembershipComparison.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { compareMemberships } from '../../services/membership.service';

const MembershipComparison = ({ currentPackageId }) => {
  const [packages, setPackages] = useState([]);
  const [allFeatures, setAllFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComparisonData = async () => {
      setIsLoading(true);
      try {
        // This would typically fetch all packages or a subset for comparison
        const data = await compareMemberships([currentPackageId]);
        setPackages(data.packages);
        
        // Extract all unique features across all packages
        const features = new Set();
        data.packages.forEach(pkg => {
          Object.keys(pkg.features).forEach(feature => {
            features.add(feature);
          });
        });
        
        setAllFeatures(Array.from(features));
      } catch (error) {
        console.error('Error fetching comparison data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComparisonData();
  }, [currentPackageId]);

  // Helper function to check if a package has a feature and what the value is
  const hasFeature = (pkg, feature) => {
    if (!pkg.features) return false;
    return pkg.features[feature];
  };

  const handleSelectPackage = (packageId) => {
    navigate(`/membership-details/${packageId}`);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading comparison data...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Features
            </th>
            {packages.map((pkg) => (
              <th
                key={pkg.id}
                scope="col"
                className={`px-6 py-3 text-left text-xs font-medium ${
                  pkg.id === currentPackageId ? 'text-blue-700' : 'text-gray-500'
                } uppercase tracking-wider`}
              >
                {pkg.name}
                <div className="mt-1 text-sm font-normal">
                  ${pkg.price}/{pkg.billingCycle}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {allFeatures.map((feature, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {feature}
              </td>
              {packages.map((pkg) => {
                const featureValue = hasFeature(pkg, feature);
                return (
                  <td
                    key={pkg.id}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                      pkg.id === currentPackageId ? 'text-blue-700' : 'text-gray-500'
                    }`}
                  >
                    {featureValue === true ? (
                      <svg 
                        className={`h-5 w-5 ${pkg.id === currentPackageId ? 'text-blue-600' : 'text-green-500'}`} 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    ) : featureValue === false ? (
                      <svg 
                        className="h-5 w-5 text-gray-400" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                    ) : (
                      <span>{featureValue}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"></td>
            {packages.map((pkg) => (
              <td key={pkg.id} className="px-6 py-4 whitespace-nowrap">
                {pkg.id !== currentPackageId ? (
                  <button
                    onClick={() => handleSelectPackage(pkg.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Select Plan
                  </button>
                ) : (
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100">
                    Current Plan
                  </span>
                )}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default MembershipComparison;