import { NextRequest, NextResponse } from "next/server";
import { initDatabase, isDatabaseConfigured } from "@/lib/db";
import { isAuthorizedAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!isAuthorizedAdmin(req)) {
    return NextResponse.json(
      { error: "Unauthorized access. Security clearance required to invoke database initialization." },
      { status: 401 }
    );
  }
  try {
    const configured = isDatabaseConfigured();
    if (!configured) {
      return NextResponse.json({
        status: "unconfigured",
        message: "DATABASE_URL is not set in environment. Running in mock fallback mode.",
        instructions:
          "Create .env.local with DATABASE_URL=postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require",
      });
    }

    const result = await initDatabase();
    return NextResponse.json({
      status: "connected",
      message: result.message,
      neonConfigured: true,
    });
  } catch (error) {
    console.error("Database initialization failed:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Failed to initialize database",
      },
      { status: 500 }
    );
  }
}

export async function POST(_req: NextRequest) {
  return GET(_req);
}
