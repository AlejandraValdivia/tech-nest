import dotenv from "dotenv";
dotenv.config();
import connectToDatabase from "./db.js";
import express from "express";
import cors from "cors";
import path from "path";

// Routes
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import emailTestRoutes from "./routes/emailTestRoutes.js";
import stripeRoute from "./routes/stripeRoute.js";
import orderRoutes from "./routes/orderRoutes.js";

connectToDatabase();
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3001", "https://tech-nest-131f.onrender.com"],
    credentials: true,
  })
);

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/checkout", stripeRoute);
app.use("/api/orders", orderRoutes);

app.get("/api/config/google", (req, res) =>
  res.send(process.env.GOOGLE_CLIENT_ID)
);

// test route
app.use("/api", emailTestRoutes);

const port = process.env.PORT || 3000;

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("Api is running...");
});

app.listen(port, () => {
  console.log(`Server runs on port ${port}`);
});
