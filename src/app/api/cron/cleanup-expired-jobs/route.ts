import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

/**
 * Cron: Deactivate expired job postings
 * Schedule: Daily at 2:00 AM UTC
 *
 * Sets is_active = false on all jobs where expires_at < now
 */
export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      logger.warn("Cron: cleanup-expired-jobs skipped — Supabase not configured", {
        endpoint: "/api/cron/cleanup-expired-jobs",
      });
      return NextResponse.json({ success: true, message: "Skipped — database not configured", deactivated: 0 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from("jobs")
      .update({ is_active: false })
      .lt("expires_at", new Date().toISOString())
      .eq("is_active", true)
      .select("id");

    if (error) throw error;

    const count = data?.length ?? 0;

    logger.info("Cron: cleanup-expired-jobs completed", {
      endpoint: "/api/cron/cleanup-expired-jobs",
      metadata: { deactivated: count },
    });

    return NextResponse.json({
      success: true,
      message: `Deactivated ${count} expired job${count !== 1 ? "s" : ""}`,
      deactivated: count,
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
