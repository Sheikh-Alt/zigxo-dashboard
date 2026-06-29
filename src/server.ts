import app from './app';
import { connectDB } from './config/database';
import { env } from './config/env';
import { logger } from './utils/logger';

const start = async (): Promise<void> => {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(`Server running → http://localhost:${env.PORT}`);
    logger.info(`Environment   → ${env.NODE_ENV}`);
  });
};

start().catch((err) => {
  logger.error('Failed to start server', err);
  process.exit(1);
});
