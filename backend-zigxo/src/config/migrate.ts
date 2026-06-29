import fs from 'fs';
import path from 'path';
import { pool, connectDB } from './database';
import { logger } from '../utils/logger';

const runMigrations = async (): Promise<void> => {
  await connectDB();

  const migrationsDir = path.join(__dirname, '../../migrations');
  const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();

  for (const file of files) {
    logger.info(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');
    await pool.query(sql);
    logger.info(`Completed: ${file}`);
  }

  await pool.end();
  logger.info('All migrations completed');
};

runMigrations().catch((err) => {
  logger.error('Migration failed:', err);
  process.exit(1);
});
