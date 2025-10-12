// Simple password-based authentication for admin access
import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import connectPg from "connect-pg-simple";

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

  // Login endpoint
  app.post("/api/admin/login", (req: Request, res: Response) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error("ADMIN_PASSWORD environment variable is not set!");
      return res.status(500).json({ message: "Server configuration error" });
    }

    if (password === adminPassword) {
      (req.session as any).isAdmin = true;
      console.log(`✅ Admin login successful at ${new Date().toISOString()}`);
      res.json({ success: true });
    } else {
      console.warn(`⚠️ Failed admin login attempt at ${new Date().toISOString()}`);
      res.status(401).json({ message: "Invalid password" });
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
