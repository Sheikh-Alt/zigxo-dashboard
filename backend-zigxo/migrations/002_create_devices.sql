CREATE TABLE IF NOT EXISTS devices (
  id           UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id    VARCHAR(255) NOT NULL REFERENCES tenants (tenant_id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL UNIQUE,
  device_ids   TEXT[]       NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_devices_tenant_id    ON devices (tenant_id);
CREATE INDEX IF NOT EXISTS idx_devices_phone_number ON devices (phone_number);
