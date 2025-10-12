// Simple password-based authentication for admin access
import type { Express, Request, Response, NextFunction } from "express";

// Simple middleware to check if user is logged in as admin
export function isAdminAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).isAdmin) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized - Admin login required" });
}

// Setup admin auth routes
export function setupSimpleAuth(app: Express) {
  // Login endpoint
  app.post("/api/admin/login", (req: Request, res: Response) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (password === adminPassword) {
      (req.session as any).isAdmin = true;
      res.json({ success: true });
    } else {
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
