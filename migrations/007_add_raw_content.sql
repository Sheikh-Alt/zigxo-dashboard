-- Add raw_content column to store extracted text without embeddings
ALTER TABLE data_sources ADD COLUMN IF NOT EXISTS raw_content TEXT;
