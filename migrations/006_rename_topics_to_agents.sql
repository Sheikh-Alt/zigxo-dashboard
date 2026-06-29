-- Rename topics table → agents and all topic_id columns → agent_id
-- Run this migration against your existing database.

-- 1. Rename the FK columns before renaming the table
ALTER TABLE instruction_sets RENAME COLUMN topic_id TO agent_id;
ALTER TABLE data_sources     RENAME COLUMN topic_id TO agent_id;
ALTER TABLE chunks           RENAME COLUMN topic_id TO agent_id;

-- 2. Rename the primary table
ALTER TABLE topics RENAME TO agents;

-- 3. Refresh indexes to match new column name
DROP INDEX IF EXISTS idx_chunks_topic_id;
CREATE INDEX IF NOT EXISTS idx_chunks_agent_id ON chunks (agent_id);

-- 4. Rename the unique constraint on instruction_sets if it was named
-- (PostgreSQL auto-names it; find the name with \d instruction_sets and rename if needed)
-- ALTER INDEX instruction_sets_topic_id_key RENAME TO instruction_sets_agent_id_key;
