import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

export default function StripePaymentForm({
  standardShipping = 4.99,
  expressShipping = 14.99,
}) {
  const stripe = useStripe();
  const elements = useElements();

  const [shippingPrice, setShippingPrice] = useState(standardShipping); // Default to Standard Shipping

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3001/success", // Redirect to /success after payment
      },
    });

    if (error) {
      setMessage(error.message);
    }

    setIsLoading(false);
  };

  const handleShippingChange = (e) => {
    const selectedShipping = e.target.value;
    setShippingPrice(
      selectedShipping === "express" ? expressShipping : standardShipping
    );
  };

  return (
    <>
    <div style={{ marginBottom: '20px' }}>
      <h3>Select Shipping Option</h3>
      <label>
        <input
          type="radio"
          name="shipping"
          value="standard"
          checked={shippingPrice === standardShipping}
          onChange={handleShippingChange}
        />
        Standard Shipping - ${standardShipping}
      </label>
      <br />
      <label>
        <input
          type="radio"
          name="shipping"
          value="express"
          checked={shippingPrice === expressShipping}
          onChange={handleShippingChange}
        />
        Express Shipping - ${expressShipping}
      </label>
    </div>
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
    </>
  );
}
