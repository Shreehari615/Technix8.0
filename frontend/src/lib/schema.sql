-- ==============================================================================
-- TECHNIX 8.0 • NEON POSTGRESQL DATABASE SCHEMA
-- Intercollegiate Technical & Cultural Fest Inspired by Marvel Cinematic Universe
-- ==============================================================================

-- 1. REGISTRATIONS TABLE
CREATE TABLE IF NOT EXISTS registrations (
  id VARCHAR(64) PRIMARY KEY,
  pass_code VARCHAR(32) NOT NULL UNIQUE,
  event_id VARCHAR(64) NOT NULL,
  event_title VARCHAR(255) NOT NULL,
  lead_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32) NOT NULL,
  college_name VARCHAR(255) NOT NULL,
  department VARCHAR(128) NOT NULL,
  year_of_study VARCHAR(64) NOT NULL,
  team_name VARCHAR(255),
  members JSONB NOT NULL DEFAULT '[]'::jsonb,
  fee_amount INTEGER NOT NULL DEFAULT 150,
  payment_method VARCHAR(32) NOT NULL DEFAULT 'UPI_QR',
  utr_number VARCHAR(64),
  screenshot_url TEXT,
  payment_status VARCHAR(32) NOT NULL DEFAULT 'paid_pending_verification',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes for Quick Verification & Passcode Lookups
CREATE INDEX IF NOT EXISTS idx_registrations_pass_code ON registrations(pass_code);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_utr ON registrations(utr_number);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);

-- 2. CONTACT & HELPDESK QUERIES TABLE
CREATE TABLE IF NOT EXISTS contact_queries (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(32),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_queries(created_at DESC);
