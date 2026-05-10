import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logger } from "@/lib/logger";

/**
 * Cron: Send daily job alert emails
 * Schedule: Daily at 8:00 AM UTC
 *
 * Finds active alerts due for sending, matches them against new jobs
 * posted since last_sent_at, and emails candidates via the Express API.
 */
export async function GET() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const apiUrl = process.env.EXPRESS_API_URL || "http://localhost:3001";

  if (!supabaseUrl || !serviceKey) {
    logger.info("Cron: send-job-alerts skipped — DB not configured");
    return NextResponse.json({ success: true, message: "Skipped — DB not configured" });
  }

  try {
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false },
    });

    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Fetch all daily alerts not sent in the last 24 hours
    const { data: jobAlerts, error: alertsError } = await supabase
      .from("job_alerts")
      .select(`
        id, label, q, location, work_arrangement, employment_type, experience_level, frequency, last_sent_at,
        candidates ( id, full_name, email )
      `)
      .eq("frequency", "daily")
      .or(`last_sent_at.is.null,last_sent_at.lt.${oneDayAgo.toISOString()}`);

    if (alertsError) throw alertsError;
    if (!jobAlerts || jobAlerts.length === 0) {
      logger.info("Cron: send-job-alerts — no alerts due", { endpoint: "/api/cron/send-job-alerts" });
      return NextResponse.json({ success: true, message: "No alerts due", alertsProcessed: 0 });
    }

    let emailsSent = 0;

    for (const alert of jobAlerts) {
      const candidate = (alert as any).candidates;
      if (!candidate?.email) continue;

      // Build job query matching this alert's filters
      let query = supabase
        .from("jobs")
        .select("id, title, slug, location, employers ( company_name )")
        .eq("is_active", true)
        .gte("posted_at", (alert.last_sent_at ?? oneDayAgo.toISOString()));

      if (alert.q) query = query.ilike("title", `%${alert.q}%`);
      if (alert.location) query = query.ilike("location", `%${alert.location}%`);
      if (alert.work_arrangement) query = query.eq("work_arrangement", alert.work_arrangement);
      if (alert.employment_type) query = query.eq("employment_type", alert.employment_type);
      if (alert.experience_level) query = query.eq("experience_level", alert.experience_level);

      const { data: jobs } = await query.limit(10);
      if (!jobs || jobs.length === 0) continue;

      // Send email via Express API's internal email helper
      const jobList = jobs.map((j: any) => ({
        title: j.title,
        company: j.employers?.company_name ?? "JTLD",
        location: j.location,
        slug: j.slug,
      }));

      // POST to internal email endpoint
      await fetch(`${apiUrl}/api/internal/send-job-alert-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-cron-secret": process.env.CRON_SECRET ?? "" },
        body: JSON.stringify({ candidateName: candidate.full_name, candidateEmail: candidate.email, jobs: jobList }),
      }).catch(() => null); // best-effort

      // Update last_sent_at
      await supabase.from("job_alerts").update({ last_sent_at: now.toISOString() }).eq("id", alert.id);
      emailsSent++;
    }

    logger.info("Cron: send-job-alerts completed", {
      endpoint: "/api/cron/send-job-alerts",
      metadata: { alertsProcessed: jobAlerts.length, emailsSent },
    });

    return NextResponse.json({
      success: true,
      message: "Job alerts processed",
      alertsProcessed: jobAlerts.length,
      emailsSent,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    logger.error("Cron: send-job-alerts failed", {
      endpoint: "/api/cron/send-job-alerts",
      metadata: { error: error instanceof Error ? error.message : "Unknown error" },
    });
    return NextResponse.json(
      { success: false, error: "Failed to send job alerts" },
      { status: 500 }
    );
  }
}
