CREATE TABLE IF NOT EXISTS pdf_uploads (
  id            UUID          PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id     VARCHAR(255)  NOT NULL REFERENCES tenants (tenant_id) ON DELETE CASCADE,
  original_name VARCHAR(500)  NOT NULL,
  file_path     VARCHAR(1000) NOT NULL,
  file_size     INTEGER       NOT NULL,
  mime_type     VARCHAR(100)  NOT NULL,
  uploaded_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pdf_uploads_tenant_id ON pdf_uploads (tenant_id);
