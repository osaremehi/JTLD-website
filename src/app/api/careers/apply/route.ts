import { NextRequest, NextResponse } from "next/server";
import { careerApplicationSchema, validateResumeFile, validateFileMagicBytes } from "@/lib/validations";
import { logger } from "@/lib/logger";
import { formatError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const requestId = req.headers.get("x-request-id") || crypto.randomUUID();

  try {
    const data = await req.formData();

    const fields = {
      name: (data.get("name") as string | null)?.trim() || "",
      email: (data.get("email") as string | null)?.trim() || "",
      phone: (data.get("phone") as string | null)?.trim() || "",
      linkedin: (data.get("linkedin") as string | null)?.trim() || "",
      area: (data.get("area") as string | null)?.trim() || "",
      message: (data.get("message") as string | null)?.trim() || "",
    };

    // Validate fields with Zod
    const parsed = careerApplicationSchema.safeParse(fields);
    if (!parsed.success) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Invalid application data", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    // Validate resume file
    const resume = data.get("resume") as File | null;
    if (!resume || resume.size === 0) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "Please attach a resume." } },
        { status: 400 }
      );
    }

    const fileError = validateResumeFile(resume);
    if (fileError) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: fileError } },
        { status: 400 }
      );
    }

    // Validate file magic bytes to prevent spoofed MIME types
    const buffer = await resume.arrayBuffer();
    if (!validateFileMagicBytes(buffer, resume.type)) {
      return NextResponse.json(
        { error: { code: "VALIDATION_ERROR", message: "File content does not match the declared file type." } },
        { status: 400 }
      );
    }

    // ── Process the application ──────────────────────────────────
    // In production, this would:
    //  1. Upload resume to S3 (AWS_S3_BUCKET)
    //  2. Store application in the database
    //  3. Send confirmation email via SendGrid
    //  4. Notify the talent team
    logger.info("New application received", {
      requestId,
      endpoint: "/api/careers/apply",
      metadata: {
        area: parsed.data.area,
        resumeName: resume.name,
        resumeSize: `${(resume.size / 1024).toFixed(1)} KB`,
        resumeType: resume.type,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully.",
    });
  } catch (error) {
    logger.error("Career application error", {
      requestId,
      endpoint: "/api/careers/apply",
      metadata: { error: error instanceof Error ? error.message : "Unknown error" },
    });
    return NextResponse.json(
      formatError(error, requestId),
      { status: 500 }
    );
  }
}
