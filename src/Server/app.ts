import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from '../Middleware/errorHandler';
import authRoutes from '../Routes/Auth';
import meRoutes from '../Routes/me';
import path from 'path';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors());
// app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(path.resolve('./public')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/me', meRoutes);

// Error handling (ensure this is after all other middleware and routes)
app.use(errorHandler);

export default app;