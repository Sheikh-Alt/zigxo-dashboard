// ── Tenant (one row = one bot) ────────────────────────────────────────────────

export interface Tenant {
  tenant_id:   string;
  tenant_name: string;
  description: string | null;
  created_at:  Date;
  updated_at:  Date;
}

export interface CreateTenantDTO {
  tenant_id?:   string;
  tenant_name:  string;
  description?: string;
}

export interface UpdateTenantDTO {
  tenant_name?:  string;
  description?:  string;
}

// ── Device (linked to a tenant) ───────────────────────────────────────────────

export interface Device {
  id:           string;
  tenant_id:    string;
  phone_number: string;
  device_ids:   string[];
  created_at:   Date;
}

export interface CreateDeviceDTO {
  phone_number: string;
  device_ids:   string[];
}

export interface UpdateDeviceDTO {
  phone_number?: string;
  device_ids?:   string[];
}

// ── PDF Upload (linked to a tenant) ──────────────────────────────────────────

export interface PdfUpload {
  id:            string;
  tenant_id:     string;
  original_name: string;
  file_path:     string;
  file_size:     number;
  mime_type:     string;
  uploaded_at:   Date;
}

export interface CreateUploadDTO {
  tenant_id:     string;
  original_name: string;
  file_path:     string;
  file_size:     number;
  mime_type:     string;
}

// ── User ──────────────────────────────────────────────────────────────────────

export interface User {
  id:         string;
  name:       string;
  email:      string;
  bot_id:     string | null;
  device_ids: string[];
}

export interface CreateUserDTO {
  id?:         string;
  name:        string;
  email:       string;
  bot_id?:     string;
  device_ids?: string[];
}

export interface UpdateUserDTO {
  name?:       string;
  email?:      string;
  bot_id?:     string;
  device_ids?: string[];
}

// ── Shared API response wrapper ───────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?:   T;
  error?:  string;
}
