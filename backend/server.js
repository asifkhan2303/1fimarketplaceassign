import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Health check - handy to confirm the server + DB are up before wiring the frontend.
app.get("/api/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Centralised 404 for unmatched API routes.
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Centralised error handler - catches anything thrown/passed via next(err).
app.use((err, _req, res, _next) => {
  console.error("[unhandled error]", err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`[server] Listening on port ${PORT}`));
};

start();
