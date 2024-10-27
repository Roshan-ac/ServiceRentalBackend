import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
// import compression from 'compression';
import { errorHandler } from '../Middleware/errorHandler';
import { CONFIG } from '../config';
import authRoutes from '../Routes/Auth';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
// app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);

// Error handling (ensure this is after all other middleware and routes)
app.use(errorHandler);

export default app;