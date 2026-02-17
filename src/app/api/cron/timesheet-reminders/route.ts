import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * Cron: Send timesheet submission reminders
 * Schedule: Every Friday at 10:00 AM UTC
 *
 * Notifies active contractors who haven't submitted their
 * timesheet for the current week.
 */
export async function GET() {
  try {
    // TODO: Replace with actual implementation

    logger.info("Cron: timesheet-reminders completed", {
      endpoint: "/api/cron/timesheet-reminders",
      metadata: { remindersSent: 0 },
    });

    return NextResponse.json({
      success: true,
      message: "Timesheet reminders processed",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error("Cron: timesheet-reminders failed", {
      endpoint: "/api/cron/timesheet-reminders",
      metadata: { error: error instanceof Error ? error.message : "Unknown error" },
    });
    return NextResponse.json(
      { success: false, error: "Failed to send timesheet reminders" },
      { status: 500 }
    );
  }
}
