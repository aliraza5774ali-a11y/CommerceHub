import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { routes } from './routes.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';
import { env } from './config/env.js';

export const app = express();
app.use(helmet());
const configuredOrigins = new Set(env.FRONTEND_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean));
const allowedOrigin = (origin, callback) => {
	if (!origin) return callback(null, true);
	let parsed;
	try { parsed = new URL(origin); } catch { return callback(null, false); }
	const developmentTenantOrigin = env.NODE_ENV !== 'production' && parsed.protocol === 'http:' && parsed.port === '5173' && parsed.hostname.endsWith(`.${env.ROOT_DOMAIN}`);
	return callback(null, configuredOrigins.has(origin) || developmentTenantOrigin);
};
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.get('/health', (req, res) => res.json({ success: true, data: { service: 'commercehub-backend', status: 'ok' } }));
app.use('/api', routes);
app.use(notFound);
app.use(errorHandler);
