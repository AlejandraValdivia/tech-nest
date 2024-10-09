import React, { useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { useSearchParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner } from '@chakra-ui/react';

const CompletePage = () => {
  const stripe = useStripe();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve the PaymentIntent client secret from URL parameters.
  const clientSecret = searchParams.get('payment_intent_client_secret');

  useEffect(() => {
    if (!stripe || !clientSecret) {
      return;
    }

    // Use Stripe to retrieve the payment intent status
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case 'succeeded':
          setMessage('Success! Payment received.');
          break;
        case 'processing':
          setMessage('Payment is processing.');
          break;
        case 'requires_payment_method':
          setMessage('Payment failed. Please try another payment method.');
          break;
        default:
          setMessage('Something went wrong.');
          break;
      }
      setLoading(false);
    });
  }, [stripe, clientSecret]);

  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading as="h2" size="xl" mb={6}>
        {loading ? <Spinner size="xl" /> : message}
      </Heading>
      <Text fontSize="lg">
        {message === 'Success! Payment received.' && 'Thank you for your purchase!'}
      </Text>
    </Box>
  );
};

export default CompletePage;
