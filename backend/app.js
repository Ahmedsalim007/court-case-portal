import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import caseApi from './routes/index.route.js';
dotenv.config();
import { errorHandler } from './middlewares/errorHandler.middleware.js';

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  })
);

app.use(express.json());

app.get('/', (req, res) => res.send('CCP API is running'));

app.use('/api/CasePortal', caseApi);
app.use(errorHandler);

export default app;
