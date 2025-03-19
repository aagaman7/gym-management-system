import React, { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Load Stripe outside of component to avoid recreating Stripe object on re-renders
const stripePromise = loadStripe('pk_test_your_public_key');

// Wrapper component that provides Stripe context
export const StripeWrapper = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

const StripePaymentComponent = ({ membershipDetails, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [error, setError] = useState(null);

  // Create a payment intent when the component mounts
  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post('/api/bookings/payment-intent', {
          membershipType: membershipDetails.type,
          services: membershipDetails.services,
          duration: membershipDetails.duration,
          totalAmount: membershipDetails.totalAmount
        });
        
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
        onError('Payment initialization failed');
      } finally {
        setIsLoading(false);
      }
    };

    createPaymentIntent();
  }, [membershipDetails]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: membershipDetails.customerName,
            email: membershipDetails.customerEmail
          }
        }
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (result.paymentIntent.status === 'succeeded') {
        // Payment succeeded, create the booking
        const bookingResponse = await axios.post('/api/bookings', {
          membershipType: membershipDetails.type,
          services: membershipDetails.services,
          duration: membershipDetails.duration,
          paymentIntentId: result.paymentIntent.id,
          customerName: membershipDetails.customerName,
          customerEmail: membershipDetails.customerEmail,
          startDate: membershipDetails.startDate
        });

        onSuccess(bookingResponse.data);
      }
    } catch (err) {
      setError(err.message || 'An error occurred during payment. Please try again.');
      onError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  return (
    <div className="stripe-payment-container">
      <h2>Payment Details</h2>
      <div className="membership-summary">
        <h3>Membership Summary</h3>
        <p>Type: {membershipDetails.type}</p>
        <p>Duration: {membershipDetails.duration} months</p>
        <p>Total: ${(membershipDetails.totalAmount / 100).toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="card-element">Credit or debit card</label>
          <CardElement id="card-element" options={cardElementOptions} />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button 
          type="submit" 
          disabled={!stripe || isLoading || !clientSecret}
          className="payment-button"
        >
          {isLoading ? 'Processing...' : `Pay $${(membershipDetails.totalAmount / 100).toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default StripePaymentComponent;