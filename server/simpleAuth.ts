// Simple password-based authentication for admin access
import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

// Rate limiting for login attempts
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

function checkRateLimit(ip: string): { allowed: boolean; remainingAttempts?: number; resetTime?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  
  if (!attempt || now > attempt.resetTime) {
    // First attempt or lockout expired
    loginAttempts.set(ip, { count: 1, resetTime: now + LOCKOUT_DURATION });
    return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - 1 };
  }
  
  if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
    // Still locked out
    return { allowed: false, resetTime: attempt.resetTime };
  }
  
  // Increment attempt count
  attempt.count++;
  return { allowed: true, remainingAttempts: MAX_LOGIN_ATTEMPTS - attempt.count };
}

function resetRateLimit(ip: string) {
  loginAttempts.delete(ip);
}

// Session configuration (reused from Replit Auth setup)
function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  // Only require secure cookies in production
  const isProduction = process.env.NODE_ENV === "production";
  
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      maxAge: sessionTtl,
    },
  });
}

// Simple middleware to check if user is logged in as admin
export function isAdminAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).isAdmin) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized - Admin login required" });
}

// Setup admin auth routes
export function setupSimpleAuth(app: Express) {
  // Set up session middleware
  app.set("trust proxy", 1);
  app.use(getSession());

  // Login endpoint with rate limiting
  app.post("/api/admin/login", (req: Request, res: Response) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const ip = req.ip || req.headers['x-forwarded-for'] as string || 'unknown';

    // Check rate limit
    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      const minutesLeft = Math.ceil((rateLimit.resetTime! - Date.now()) / 60000);
      console.warn(`🚫 Admin login blocked - too many attempts from IP: ${ip}`);
      return res.status(429).json({ 
        message: `Too many login attempts. Please try again in ${minutesLeft} minutes.`,
        remainingAttempts: 0
      });
    }

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    if (password === adminPassword) {
      (req.session as any).isAdmin = true;
      resetRateLimit(ip); // Reset on successful login
      console.log(`✅ Admin login successful from IP: ${ip} at ${new Date().toISOString()}`);
      res.json({ success: true });
    } else {
      console.warn(`⚠️ Failed admin login attempt from IP: ${ip} at ${new Date().toISOString()} - ${rateLimit.remainingAttempts} attempts remaining`);
      res.status(401).json({ 
        message: "Invalid password",
        remainingAttempts: rateLimit.remainingAttempts
      });
    }
  });

  // Logout endpoint
  app.post("/api/admin/logout", (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).json({ message: "Logout failed" });
      } else {
        res.json({ success: true });
      }
    });
  });

  // Check auth status
  app.get("/api/admin/check", (req: Request, res: Response) => {
    const isAuthenticated = !!(req.session && (req.session as any).isAdmin);
    res.json({ isAuthenticated });
  });
}
