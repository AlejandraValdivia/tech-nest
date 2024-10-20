import dotenv from "dotenv";
dotenv.config();

import express from "express";
import Stripe from "stripe";
import { protectRoute } from "../middleware/authMiddleware.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const stripeRoute = express.Router();

const STANDARD_SHIPPING_ID = process.env.STANDARD_SHIPPING_ID;
const EXPRESS_SHIPPING_ID = process.env.EXPRESS_SHIPPING_ID;

stripeRoute.post("/create-payment-intent", protectRoute, async (req, res) => {
  const data = req.body;

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).send("Stripe secret key is missing.");
    }

    const calculateOrderAmount = (items) => {
      let total = 0;
      items.forEach((item) => {
        total += item.amount;
      });

      if (data.shipping === "standard") {
        total += Number(STANDARD_SHIPPING_ID);
      } else if (data.shipping === "express") {
        total += Number(EXPRESS_SHIPPING_ID);
      }

      return total;
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(req.body.items), 
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    console.log("Payment Intent Created:", paymentIntent);

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error.message);
    res.status(500).send("Internal Server Error");
  }
});

stripeRoute.route('/').post(protectRoute, stripeRoute)
export default stripeRoute;
