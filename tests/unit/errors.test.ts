import { AppError, formatError } from "@/lib/errors";

describe("AppError", () => {
  it("creates an error with code, statusCode, and message", () => {
    const err = new AppError("NOT_FOUND", 404, "Resource not found");
    expect(err.code).toBe("NOT_FOUND");
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe("Resource not found");
    expect(err.name).toBe("AppError");
    expect(err).toBeInstanceOf(Error);
  });

  it("accepts optional details", () => {
    const err = new AppError("VALIDATION", 400, "Bad input", { field: "email" });
    expect(err.details).toEqual({ field: "email" });
  });
});

describe("formatError", () => {
  it("formats an AppError with code and details", () => {
    const err = new AppError("RATE_LIMITED", 429, "Too many requests", { retryAfter: 60 });
    const result = formatError(err, "req-123");
    expect(result).toEqual({
      error: {
        code: "RATE_LIMITED",
        message: "Too many requests",
        details: { retryAfter: 60 },
      },
      meta: { requestId: "req-123" },
    });
  });

  it("formats a generic Error in non-production", () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";
    const result = formatError(new Error("Something broke"), "req-456");
    expect(result.error.code).toBe("INTERNAL_ERROR");
    expect(result.error.message).toBe("Something broke");
    expect(result.meta.requestId).toBe("req-456");
    process.env.NODE_ENV = original;
  });

  it("hides internal errors in production", () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const result = formatError(new Error("DB connection failed"));
    expect(result.error.message).toBe("An unexpected error occurred");
    process.env.NODE_ENV = original;
  });

  it("handles non-Error values", () => {
    const result = formatError("string error");
    expect(result.error.code).toBe("INTERNAL_ERROR");
  });

  it("includes requestId in meta when provided", () => {
    const result = formatError(new Error("err"), "abc");
    expect(result.meta.requestId).toBe("abc");
  });

  it("meta.requestId is undefined when not provided", () => {
    const result = formatError(new Error("err"));
    expect(result.meta.requestId).toBeUndefined();
  });
});
