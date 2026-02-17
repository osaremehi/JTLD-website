import { z } from "zod";
import { ALLOWED_RESUME_TYPES, MAX_RESUME_SIZE } from "./constants";

// ── Chat API ──────────────────────────────────────────────────
export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

export const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1).max(50),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;
export type ChatRequest = z.infer<typeof chatRequestSchema>;

// ── Career Application ────────────────────────────────────────
export const careerApplicationSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  email: z.string().email("Please provide a valid email address"),
  phone: z.string().max(30).optional(),
  linkedin: z.string().url("Please provide a valid URL").max(500).optional().or(z.literal("")),
  area: z.string().min(1, "Area of interest is required").max(200),
  message: z.string().max(2000).optional(),
});

export type CareerApplication = z.infer<typeof careerApplicationSchema>;

// ── File validation helpers ───────────────────────────────────
const PDF_MAGIC = [0x25, 0x50, 0x44, 0x46]; // %PDF
const DOC_MAGIC = [0xd0, 0xcf, 0x11, 0xe0]; // MS Compound Binary
const DOCX_MAGIC = [0x50, 0x4b, 0x03, 0x04]; // ZIP (DOCX is zipped XML)

export function validateFileMagicBytes(buffer: ArrayBuffer, mimeType: string): boolean {
  const bytes = new Uint8Array(buffer).slice(0, 4);

  if (mimeType === "application/pdf") {
    return PDF_MAGIC.every((b, i) => bytes[i] === b);
  }
  if (mimeType === "application/msword") {
    return DOC_MAGIC.every((b, i) => bytes[i] === b);
  }
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    return DOCX_MAGIC.every((b, i) => bytes[i] === b);
  }
  return false;
}

export function validateResumeFile(file: File): string | null {
  if (!file || file.size === 0) return "Please attach a resume.";
  if (file.size > MAX_RESUME_SIZE) return `Resume must be under ${MAX_RESUME_SIZE / (1024 * 1024)} MB.`;
  if (!ALLOWED_RESUME_TYPES.includes(file.type)) return "Resume must be a PDF or Word document.";
  return null;
}
