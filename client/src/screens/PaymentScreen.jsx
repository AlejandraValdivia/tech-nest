// src/screens/PaymentScreen.jsx
import React, { useEffect, useState } from 'react';
import { Box, Heading, Text, VStack, Spinner } from '@chakra-ui/react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../components/StripePaymentForm'; // Import the new component

const stripePromise = loadStripe('pk_test_51PfAxmHSj68L6PEF5WRxX17cttrnXo5EKtMSkWviBlMnjEoegt7gg0sOH22mImJToweNKR2Gd1q1oJgqoeqegRcO00G8DhacZC'); // Replace with your Stripe publishable key

const PaymentScreen = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  // Function to fetch the Stripe client secret from your server
  const getClientSecret = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo || !userInfo.token) {
      console.error('User is not logged in or token is missing');
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };

      const { data } = await axios.post(
        'http://localhost:3001/api/checkout/create-payment-intent',
        { items: [{ id: 'item1', amount: 1000 }] }, // Replace with your actual items
        config
      );

      console.log('Client Secret:', data.clientSecret);
      setClientSecret(data.clientSecret);
      setLoading(false);
    } catch (error) {
      console.error('Error getting client secret:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call getClientSecret when the component mounts
    getClientSecret();
  }, []);

  return (
    <VStack>
      <Box maxW="4xl" mx="auto" textAlign="center">
        <Heading as="h1" mb="6">
          Payment Gateway
        </Heading>
        <Text fontSize="lg">
          You are about to make your payment. Please review your details and proceed.
        </Text>

        {/* Show loading spinner while fetching the client secret */}
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <>
            {/* Render Stripe Payment Elements here after you get the client secret */}
            {clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm clientSecret={clientSecret} />
              </Elements>
            ) : (
              <Text fontSize="md" color="red.500">
                Error fetching client secret. Please try again.
              </Text>
            )}
          </>
        )}
      </Box>
    </VStack>
  );
};

export default PaymentScreen;
