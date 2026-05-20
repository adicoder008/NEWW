import express from "express";
import cors from "cors";
import analysisRoutes from "./routes/analysisRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  const origin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
  app.use(
    cors({
      origin: origin.split(",").map((o) => o.trim()),
      methods: ["GET", "POST"],
    })
  );

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "resumind-api" });
  });

  app.use("/api/analyses", analysisRoutes);
  app.use(errorHandler);

  return app;
}
