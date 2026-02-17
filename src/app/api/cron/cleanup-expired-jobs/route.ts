import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Cron: Deactivate expired job postings
 * Schedule: Daily at 2:00 AM UTC
 *
 * Sets isActive = false on all jobs where expiresAt < now
 */
export async function GET() {
  try {
    // TODO: Replace with Prisma query once database is set up
    const result = { count: 0 };

    logger.info("Cron: cleanup-expired-jobs completed", {
      endpoint: "/api/cron/cleanup-expired-jobs",
      metadata: { deactivated: result.count },
    });

    return NextResponse.json({
      success: true,
      message: `Deactivated ${result.count} expired jobs`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Cron: cleanup-expired-jobs failed", {
      endpoint: "/api/cron/cleanup-expired-jobs",
      metadata: { error: error instanceof Error ? error.message : "Unknown error" },
    });
    return NextResponse.json(
      { success: false, error: "Failed to clean up expired jobs" },
      { status: 500 }
    );
  }
}
