import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Stripe from "stripe";
import Order from "../models/Order.js"; // Assuming you have an Order model
import { protectRoute } from "../middleware/authMiddleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripeRoute = express.Router();

stripeRoute.post("/create-payment-intent", async (req, res) => {
  try {
    console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY); // Log Stripe Secret Key for debugging
    console.log("Received Items:", req.body.items); // Log the items received from the frontend

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).send("Stripe secret key is missing.");
    }

    // Calculate the order amount based on the items received
    const calculateOrderAmount = (items) => {
      let total = 0;
      items.forEach((item) => {
        total += item.amount;
      });
      return total;
    };

    // Create a PaymentIntent with the calculated amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(req.body.items), // Calculate amount based on items
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    console.log("Payment Intent Created:", paymentIntent);

    // Respond with the client secret for the frontend to complete the payment
    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

export default stripeRoute;
