import { NextRequest, NextResponse } from "next/server";

// ── Rate limiting (in-memory for edge, use Redis in production) ──
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const MAX_RATE_LIMIT_ENTRIES = 10_000;
let lastCleanup = Date.now();

const RATE_LIMITS: Record<string, { max: number; windowMs: number }> = {
  "/api/chat": { max: 20, windowMs: 60_000 },
  "/api/careers/apply": { max: 5, windowMs: 60_000 },
  "/api/v1/auth": { max: 5, windowMs: 60_000 },
  "/api/v1/upload": { max: 10, windowMs: 60_000 },
  "/api/v1": { max: 100, windowMs: 60_000 },
};

function getRateLimit(pathname: string) {
  for (const [prefix, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(prefix)) return config;
  }
  return null;
}

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;

  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(key);
    }
  }

  if (rateLimitStore.size > MAX_RATE_LIMIT_ENTRIES) {
    rateLimitStore.clear();
  }
}

function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanupExpiredEntries();

  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    const resetAt = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: max - 1, resetAt };
  }

  entry.count++;
  const allowed = entry.count <= max;
  return { allowed, remaining: Math.max(0, max - entry.count), resetAt: entry.resetAt };
}

// ── Protected route patterns ─────────────────────────────────
const PROTECTED_ROUTES = [
  "/candidate",
  "/employer",
  "/recruiter",
  "/admin",
];

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();

  // ── Request ID ───────────────────────────────────────────
  const requestId = crypto.randomUUID();
  response.headers.set("x-request-id", requestId);

  // ── API rate limiting ────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const rateLimit = getRateLimit(pathname);
    if (rateLimit) {
      const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
      const key = `${ip}:${pathname.split("/").slice(0, 4).join("/")}`;
      const { allowed, remaining, resetAt } = checkRateLimit(key, rateLimit.max, rateLimit.windowMs);

      response.headers.set("X-RateLimit-Limit", rateLimit.max.toString());
      response.headers.set("X-RateLimit-Remaining", remaining.toString());
      response.headers.set("X-RateLimit-Reset", Math.ceil(resetAt / 1000).toString());

      if (!allowed) {
        return NextResponse.json(
          {
            error: {
              code: "RATE_LIMITED",
              message: "Too many requests. Please try again later.",
            },
            meta: { requestId },
          },
          {
            status: 429,
            headers: {
              "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(),
              "X-RateLimit-Limit": rateLimit.max.toString(),
              "X-RateLimit-Remaining": "0",
              "X-RateLimit-Reset": Math.ceil(resetAt / 1000).toString(),
            },
          }
        );
      }
    }

    // Skip auth check for public API routes
    if (pathname === "/api/health" || pathname.startsWith("/api/webhooks/")) {
      return response;
    }
  }

  // ── Auth route redirect (logged-in users shouldn't see login page) ──
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    // Check for session token cookie
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // ── Protected route access control ───────────────────────
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route))) {
    const sessionToken =
      request.cookies.get("next-auth.session-token")?.value ||
      request.cookies.get("__Secure-next-auth.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // ── Cron job authentication ──────────────────────────────
  if (pathname.startsWith("/api/cron/")) {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Invalid cron secret" } },
        { status: 401 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images/|fonts/).*)",
  ],
};
