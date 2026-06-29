import { Pool } from 'pg';
import { env } from './env';
import { logger } from '../utils/logger';

export const pool = new Pool({
  host:     env.DB.HOST,
  port:     env.DB.PORT,
  database: env.DB.NAME,
  user:     env.DB.USER,
  password: env.DB.PASSWORD,
});

export const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    client.release();
    logger.info('PostgreSQL connected successfully');
  } catch (err) {
    logger.error('Database connection failed', err);
    process.exit(1);
  }
};
