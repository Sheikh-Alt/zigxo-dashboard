import express from 'express';
import cors    from 'cors';
import morgan  from 'morgan';
import path    from 'path';
import fs      from 'fs';

import routes from './routes/index.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { env } from './config/env';

// Auto-create uploads folder for local storage mode
if (env.STORAGE === 'local') {
  fs.mkdirSync(path.resolve(env.UPLOAD_DIR), { recursive: true });
}

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static uploads: GET /files/<tenantId>/<filename>
app.use('/files', express.static(path.resolve(env.UPLOAD_DIR)));

app.get('/health', (_req, res) => {
  res.json({
    ok:        true,
    env:       env.NODE_ENV,
    storage:   env.STORAGE,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1', routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
