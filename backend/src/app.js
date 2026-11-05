const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const batchRoutes = require("./routes/batchRoutes");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN ? process.env.CLIENT_ORIGIN.split(",").map((v) => v.trim()) : "http://localhost:5173"
}));
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Batch Operations API is healthy." });
});
app.use("/api/batches", batchRoutes);
app.use(notFound);
app.use(errorHandler);

module.exports = app;
