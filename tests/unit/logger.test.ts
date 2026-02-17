import { logger } from "@/lib/logger";

describe("logger", () => {
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;

  beforeEach(() => {
    logSpy = jest.spyOn(console, "log").mockImplementation();
    errorSpy = jest.spyOn(console, "error").mockImplementation();
    warnSpy = jest.spyOn(console, "warn").mockImplementation();
    debugSpy = jest.spyOn(console, "debug").mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("logger.info writes JSON to console.log", () => {
    logger.info("test message");
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(logSpy.mock.calls[0][0]);
    expect(output.level).toBe("info");
    expect(output.message).toBe("test message");
    expect(output.timestamp).toBeDefined();
  });

  it("logger.error writes to console.error", () => {
    logger.error("something failed", { requestId: "r1" });
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(errorSpy.mock.calls[0][0]);
    expect(output.level).toBe("error");
    expect(output.requestId).toBe("r1");
  });

  it("logger.warn writes to console.warn", () => {
    logger.warn("be careful");
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(warnSpy.mock.calls[0][0]);
    expect(output.level).toBe("warn");
  });

  it("logger.fatal writes to console.error", () => {
    logger.fatal("critical failure");
    expect(errorSpy).toHaveBeenCalledTimes(1);
    const output = JSON.parse(errorSpy.mock.calls[0][0]);
    expect(output.level).toBe("fatal");
  });

  it("logger.debug writes in non-production", () => {
    const original = process.env.NODE_ENV;
    process.env.NODE_ENV = "test";
    logger.debug("debug info");
    expect(debugSpy).toHaveBeenCalledTimes(1);
    process.env.NODE_ENV = original;
  });

  it("includes metadata in log output", () => {
    logger.info("request handled", { endpoint: "/api/chat", statusCode: 200, duration: 150 });
    const output = JSON.parse(logSpy.mock.calls[0][0]);
    expect(output.endpoint).toBe("/api/chat");
    expect(output.statusCode).toBe(200);
    expect(output.duration).toBe(150);
  });
});
