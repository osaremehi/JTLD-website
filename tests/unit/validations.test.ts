import {
  chatMessageSchema,
  chatRequestSchema,
  careerApplicationSchema,
  validateFileMagicBytes,
  validateResumeFile,
} from "@/lib/validations";

// ── chatMessageSchema ──────────────────────────────────────────

describe("chatMessageSchema", () => {
  it("accepts a valid user message", () => {
    const result = chatMessageSchema.safeParse({ role: "user", content: "Hello" });
    expect(result.success).toBe(true);
  });

  it("accepts a valid assistant message", () => {
    const result = chatMessageSchema.safeParse({ role: "assistant", content: "Hi there" });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid role", () => {
    const result = chatMessageSchema.safeParse({ role: "system", content: "Hi" });
    expect(result.success).toBe(false);
  });

  it("rejects empty content", () => {
    const result = chatMessageSchema.safeParse({ role: "user", content: "" });
    expect(result.success).toBe(false);
  });

  it("rejects content exceeding 4000 characters", () => {
    const result = chatMessageSchema.safeParse({ role: "user", content: "a".repeat(4001) });
    expect(result.success).toBe(false);
  });

  it("accepts content at exactly 4000 characters", () => {
    const result = chatMessageSchema.safeParse({ role: "user", content: "a".repeat(4000) });
    expect(result.success).toBe(true);
  });
});

// ── chatRequestSchema ──────────────────────────────────────────

describe("chatRequestSchema", () => {
  it("accepts a valid request with one message", () => {
    const result = chatRequestSchema.safeParse({
      messages: [{ role: "user", content: "Hello" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty messages array", () => {
    const result = chatRequestSchema.safeParse({ messages: [] });
    expect(result.success).toBe(false);
  });

  it("rejects more than 50 messages", () => {
    const messages = Array.from({ length: 51 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message ${i}`,
    }));
    const result = chatRequestSchema.safeParse({ messages });
    expect(result.success).toBe(false);
  });

  it("accepts exactly 50 messages", () => {
    const messages = Array.from({ length: 50 }, (_, i) => ({
      role: i % 2 === 0 ? "user" : "assistant",
      content: `Message ${i}`,
    }));
    const result = chatRequestSchema.safeParse({ messages });
    expect(result.success).toBe(true);
  });
});

// ── careerApplicationSchema ────────────────────────────────────

describe("careerApplicationSchema", () => {
  const validApp = {
    name: "Jane Doe",
    email: "jane@example.com",
    area: "Engineering",
  };

  it("accepts a minimal valid application", () => {
    const result = careerApplicationSchema.safeParse(validApp);
    expect(result.success).toBe(true);
  });

  it("accepts a full application with all optional fields", () => {
    const result = careerApplicationSchema.safeParse({
      ...validApp,
      phone: "416-555-1234",
      linkedin: "https://linkedin.com/in/janedoe",
      message: "I am interested in this position.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing name", () => {
    const result = careerApplicationSchema.safeParse({ email: "a@b.com", area: "Eng" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const result = careerApplicationSchema.safeParse({ ...validApp, email: "not-email" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid linkedin URL", () => {
    const result = careerApplicationSchema.safeParse({ ...validApp, linkedin: "not-a-url" });
    expect(result.success).toBe(false);
  });

  it("allows empty string for linkedin", () => {
    const result = careerApplicationSchema.safeParse({ ...validApp, linkedin: "" });
    expect(result.success).toBe(true);
  });

  it("rejects name over 200 characters", () => {
    const result = careerApplicationSchema.safeParse({ ...validApp, name: "x".repeat(201) });
    expect(result.success).toBe(false);
  });
});

// ── validateFileMagicBytes ─────────────────────────────────────

describe("validateFileMagicBytes", () => {
  it("validates a PDF file", () => {
    const buffer = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]).buffer;
    expect(validateFileMagicBytes(buffer, "application/pdf")).toBe(true);
  });

  it("rejects a non-PDF masquerading as PDF", () => {
    const buffer = new Uint8Array([0x50, 0x4b, 0x03, 0x04]).buffer;
    expect(validateFileMagicBytes(buffer, "application/pdf")).toBe(false);
  });

  it("validates a DOC file", () => {
    const buffer = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0]).buffer;
    expect(validateFileMagicBytes(buffer, "application/msword")).toBe(true);
  });

  it("validates a DOCX file", () => {
    const buffer = new Uint8Array([0x50, 0x4b, 0x03, 0x04]).buffer;
    expect(
      validateFileMagicBytes(
        buffer,
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ),
    ).toBe(true);
  });

  it("rejects unknown MIME type", () => {
    const buffer = new Uint8Array([0x25, 0x50, 0x44, 0x46]).buffer;
    expect(validateFileMagicBytes(buffer, "text/plain")).toBe(false);
  });

  it("rejects buffer shorter than 4 bytes", () => {
    const buffer = new Uint8Array([0x25, 0x50]).buffer;
    expect(validateFileMagicBytes(buffer, "application/pdf")).toBe(false);
  });
});

// ── validateResumeFile ─────────────────────────────────────────

describe("validateResumeFile", () => {
  function makeFile(name: string, size: number, type: string): File {
    const content = new Uint8Array(size);
    return new File([content], name, { type });
  }

  it("returns null for a valid PDF file", () => {
    const file = makeFile("resume.pdf", 1024, "application/pdf");
    expect(validateResumeFile(file)).toBeNull();
  });

  it("returns error for file exceeding size limit", () => {
    const file = makeFile("big.pdf", 11 * 1024 * 1024, "application/pdf");
    expect(validateResumeFile(file)).toContain("under");
  });

  it("returns error for disallowed MIME type", () => {
    const file = makeFile("image.png", 1024, "image/png");
    expect(validateResumeFile(file)).toContain("PDF or Word");
  });

  it("returns error for zero-size file", () => {
    const file = makeFile("empty.pdf", 0, "application/pdf");
    expect(validateResumeFile(file)).toContain("attach");
  });
});
