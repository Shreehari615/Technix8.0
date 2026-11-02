const { neon } = require("@neondatabase/serverless");

const url =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_dFEMhN5uXK8C@ep-polished-queen-bd80g241-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = neon(url);

async function main() {
  try {
    console.log("Connecting to Neon PostgreSQL...");
    const versionRes = await sql`SELECT version();`;
    console.log("Connected successfully!");
    console.log("PostgreSQL Version:", versionRes[0].version);

    console.log("Creating tables and indexes...");

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

    const tables = await sql`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
    `;

    console.log("Tables confirmed in Neon database:", tables.map((t) => t.table_name));
    console.log("Neon database initialization completed successfully!");
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
}

main();
