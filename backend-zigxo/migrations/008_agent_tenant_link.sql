-- Add description to tenants
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS description TEXT;

-- Add tenant_id to agents (stores the auto-generated nanoid tenant reference)
ALTER TABLE agents ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(255);
