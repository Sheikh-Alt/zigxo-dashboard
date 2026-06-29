import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT:         process.env.PORT     || '3000',
  NODE_ENV:     process.env.NODE_ENV || 'development',
  DB: {
    HOST:     process.env.DB_HOST     || 'localhost',
    PORT:     parseInt(process.env.DB_PORT || '5432', 10),
    NAME:     process.env.DB_NAME     || 'zigxo_db',
    USER:     process.env.DB_USER     || 'postgres',
    PASSWORD: process.env.DB_PASSWORD || '',
  },
  UPLOAD_DIR:    process.env.UPLOAD_DIR    || 'uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '10485760', 10),

  // Agents / RAG additions
  STORAGE:         process.env.STORAGE          || 'local',
  REDIS_HOST:      process.env.REDIS_HOST       || 'localhost',
  REDIS_PORT:      parseInt(process.env.REDIS_PORT || '6379', 10),
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME  || '',
  NOTION_API_TOKEN: process.env.NOTION_API_TOKEN || '',
};
