import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { routes } from './routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';

export const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.get('/health', (req, res) => res.json({ success: true, data: { service: 'commercehub-backend', status: 'ok' } }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);
