import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import { errorHandler, notFound } from "../Middleware/errorHandler";
import { resourceLimits } from "worker_threads";
import routes from "../Routes/index";
import testRoutes from "../Routes/test/index";

const app = express();
app.use(cookieParser());

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

// Serve static files like images
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(authorize);

// We are using v1 route for our api

app.use("/api/", routes);
app.use("/api/", testRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
