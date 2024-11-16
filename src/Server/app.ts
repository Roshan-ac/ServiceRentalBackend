import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "../Middleware/errorHandler";
import authRoutes from "../Routes/Auth";
import meRoutes from "../Routes/me";
import path from "path";
import postRoutes from "../Routes/posts";

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
// app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  "/public",
  express.static(path.resolve("./public"), {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// Routes
// app.use("/", (req, res) => {
//   res.send("Service Rental API");
// });
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/post",postRoutes)

// Error handling (ensure this is after all other middleware and routes)
app.use(errorHandler);

export default app;
