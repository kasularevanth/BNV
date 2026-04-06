const express = require("express");
const cors = require("cors");
const corsOptions = require("./config/cors");
const authRoutes = require("./routes/authRoutes");
const mockupRoutes = require("./routes/mockupRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

// Handle preflight OPTIONS requests for all routes
app.options(/(.*)/,  cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/mockups", mockupRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date() }),
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
