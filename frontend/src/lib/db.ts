import { neon, NeonQueryFunction } from "@neondatabase/serverless";

/**
 * Checks if a valid database connection string is provided in the environment.
 */
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL;
  return Boolean(url && url.startsWith("postgres"));
}

/**
 * Returns the Neon SQL tagged template executor.
 * Throws a helpful descriptive error if DATABASE_URL is missing.
 */
export function getDb(): NeonQueryFunction<false, false> {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString || !connectionString.startsWith("postgres")) {
    throw new Error(
      "DATABASE_URL is not configured in .env.local. Please provide your Neon PostgreSQL connection string: postgresql://..."
    );
  }

  return neon(connectionString);
}

/**
 * In-memory fallback repository when running locally without a live DATABASE_URL.
 * This guarantees the developer experience remains buttery-smooth while testing.
 */
export interface RegistrationRow {
  id: string;
  pass_code: string;
  event_id: string;
  event_title: string;
  lead_name: string;
  email: string;
  phone: string;
  college_name: string;
  department: string;
  year_of_study: string;
  team_name?: string | null;
  members: string[] | string;
  fee_amount: number;
  payment_method: string;
  utr_number?: string | null;
  screenshot_url?: string | null;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

// Global in-memory cache for fallback mode (persists across hot reloads in dev)
const globalForMock = globalThis as unknown as {
  __mockRegistrations?: Map<string, RegistrationRow>;
};

export const mockRegistrations =
  globalForMock.__mockRegistrations || new Map<string, RegistrationRow>();
if (process.env.NODE_ENV !== "production") {
  globalForMock.__mockRegistrations = mockRegistrations;
}

/**
 * Ensures required tables and indexes exist in Neon PostgreSQL.
 * Automatically called on demand or via /api/init-db.
 */
export async function initDatabase(): Promise<{ success: boolean; message: string }> {
  if (!isDatabaseConfigured()) {
    return {
      success: false,
      message: "DATABASE_URL is not configured. Running in mock fallback mode.",
    };
  }

  const sql = getDb();

  await sql`
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
  `;

  await sql`CREATE INDEX IF NOT EXISTS idx_registrations_pass_code ON registrations(pass_code);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_registrations_utr ON registrations(utr_number);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at DESC);`;

  await sql`
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
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS event_overrides (
      event_id VARCHAR(64) PRIMARY KEY,
      custom_title VARCHAR(255),
      custom_subtitle VARCHAR(255),
      custom_fee INTEGER,
      winning_prize VARCHAR(64),
      runner_up_prize VARCHAR(64),
      venue VARCHAR(255),
      schedule_time VARCHAR(255),
      is_open BOOLEAN DEFAULT true,
      coordinators JSONB,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  return {
    success: true,
    message: "Neon PostgreSQL database initialized with registrations, contact, and event_overrides tables.",
  };
}
