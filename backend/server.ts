import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import session from "express-session";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";
import { GoogleGenAI, Type } from "@google/genai";

// ---------------------------------------------------------------------------
// Database Initialization — use Railway volume if available
// ---------------------------------------------------------------------------
const dataDir = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.cwd();
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, "twinstack.db");
const db = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// Helper for UUID-like IDs
const generateId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);

// ---------------------------------------------------------------------------
// Create Tables
// ---------------------------------------------------------------------------
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE,
    email TEXT UNIQUE,
    role TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    country TEXT,
    gender TEXT,
    purpose TEXT,
    skills TEXT, -- JSON string
    twitter TEXT,
    github TEXT,
    photo_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    owner TEXT,
    type TEXT,
    visibility TEXT DEFAULT 'public',
    status TEXT,
    created_by_role TEXT,
    is_public_global_project INTEGER DEFAULT 0,
    always_visible INTEGER DEFAULT 0,
    architect_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(architect_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS requests (
    id TEXT PRIMARY KEY,
    project_id TEXT NOT NULL,
    non_tech_description TEXT,
    tech_description TEXT,
    status TEXT DEFAULT 'pending',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    implemented INTEGER DEFAULT 0,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  );

  CREATE TABLE IF NOT EXISTS terms_acceptance (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    accepted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    version TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

// ---------------------------------------------------------------------------
// Seed Functions
// ---------------------------------------------------------------------------
function seedTwinStackCoreData() {
  console.log("Seeding TwinStack Core Data...");
  try {
    const existingRow = db.prepare("PRAGMA table_info(projects)").all() as any[];
    const columns = existingRow.map((c) => c.name);
    if (!columns.includes("is_default_public_project")) {
      db.exec(
        `ALTER TABLE projects ADD COLUMN is_default_public_project INTEGER DEFAULT 0;`
      );
    }
    if (!columns.includes("protected_from_deletion")) {
      db.exec(
        `ALTER TABLE projects ADD COLUMN protected_from_deletion INTEGER DEFAULT 0;`
      );
    }

    const existingProject = db
      .prepare("SELECT id FROM projects WHERE slug = 'twinstack'")
      .get() as any;
    const projectId = existingProject ? existingProject.id : "twinstack";

    db.prepare(
      `
      INSERT INTO projects (id, slug, title, description, owner, type, visibility, status, created_by_role, is_public_global_project, always_visible, architect_id, is_default_public_project, protected_from_deletion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET 
        title = excluded.title,
        description = excluded.description,
        owner = excluded.owner,
        type = excluded.type,
        visibility = excluded.visibility,
        status = excluded.status,
        created_by_role = excluded.created_by_role,
        is_public_global_project = excluded.is_public_global_project,
        always_visible = excluded.always_visible,
        is_default_public_project = excluded.is_default_public_project,
        protected_from_deletion = excluded.protected_from_deletion
    `
    ).run(
      projectId,
      "twinstack",
      "TwinStack",
      "TwinStack is the official build-in-public project where Parallax Studio improves the platform in real time.",
      "Parallax Studio",
      "build-in-public",
      "public-read",
      "active",
      "architect",
      1,
      1,
      "architect-id",
      1,
      1
    );

    const featuredRequests = [
      {
        id: "login-roles",
        nonTech:
          "Add login cards for The Architect, The Builder and Vibecoder Guest.",
        tech: "Implement role-based login entry with architect, builder and vibecoder guest flows.",
      },
      {
        id: "project-dashboard",
        nonTech:
          "Add dashboard where users can view and select app projects.",
        tech: "Implement project list query with TwinStack always included as global public project.",
      },
      {
        id: "new-app-concept",
        nonTech:
          "Let The Architect create app concepts with title and description.",
        tech: "Add concept creation modal with title and max 1500-character description field.",
      },
      {
        id: "splitview-workspace",
        nonTech:
          "Show request input on the left and Builder queue on the right.",
        tech: "Implement responsive splitview workspace with composer and approved request queue.",
      },
      {
        id: "ai-request-structuring",
        nonTech:
          "Turn raw ideas into clear non-technical and technical request summaries.",
        tech: "Add AI structuring output with max 250 chars for each summary field.",
      },
      {
        id: "approve-to-queue",
        nonTech:
          "Let The Architect approve structured requests into The Builder queue.",
        tech: "Save approved request cards to the project queue with timestamp and status.",
      },
      {
        id: "builder-popup",
        nonTech: "Notify The Builder when a new approved request arrives.",
        tech: "Trigger builder notification popup after approved request creation.",
      },
      {
        id: "vibecoder-onboarding",
        nonTech:
          "Guests accept terms and create a profile before viewing TwinStack.",
        tech: "Implement terms acceptance, guest account creation and vibecoder profile data.",
      },
      {
        id: "guest-readonly-view",
        nonTech:
          "Vibecoder Guests can follow TwinStack in real time without editing.",
        tech: "Restrict guest role to read-only access for TwinStack with fork/branch placeholder actions.",
      },
      {
        id: "landing-legal-support",
        nonTech:
          "Add landing page, founder story, legal protection and support section.",
        tech: "Implement landing page sections, terms flow, copyright notice and support CTA.",
      },
    ];

    const insertRequest = db.prepare(`
      INSERT INTO requests (id, project_id, non_tech_description, tech_description, status, timestamp, implemented)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        non_tech_description = excluded.non_tech_description,
        tech_description = excluded.tech_description,
        status = excluded.status,
        implemented = excluded.implemented
    `);

    let newCount = 0;
    for (const req of featuredRequests) {
      const res = insertRequest.run(
        req.id,
        projectId,
        req.nonTech,
        req.tech,
        "approved",
        new Date().toISOString(),
        1
      );
      if (res.changes > 0) newCount++;
    }

    console.log("TwinStack seed completed");
  } catch (error) {
    console.error("TwinStack seed error:", error);
  }
}

function seedDatabase() {
  console.log("Seeding Database...");

  // Read seeded passwords from env or use defaults (dev only)
  const architectPassword =
    process.env.ARCHITECT_PASSWORD || "TwinStack_Architect!2026_Parallax#Orbit";
  const builderPassword =
    process.env.BUILDER_PASSWORD || "TwinStack_Builder!2026_Forge#Vertex";
  const subscriberPassword = process.env.SUBSCRIBER_PASSWORD || "password";

  if (!process.env.ARCHITECT_PASSWORD || !process.env.BUILDER_PASSWORD) {
    console.warn(
      "⚠️  WARNING: ARCHITECT_PASSWORD / BUILDER_PASSWORD not set in env. Using default dev passwords. Set them in production!"
    );
  }

  const architect = {
    id: "architect-id",
    username: "architect",
    role: "Architect",
    password: architectPassword,
  };

  const builder = {
    id: "builder-id",
    username: "builder",
    role: "Builder",
    password: builderPassword,
  };

  const subscriber = {
    id: "subscriber-id",
    username: "subscriber",
    email: "subscriber@example.com",
    role: "Subscribed User",
    password: subscriberPassword,
  };

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, username, email, role, password_hash)
    VALUES (?, ?, ?, ?, ?)
  `);

  for (const user of [architect, builder]) {
    const hash = bcrypt.hashSync(user.password, 10);
    insertUser.run(user.id, user.username, null, user.role, hash);
  }

  const subHash = bcrypt.hashSync(subscriber.password, 10);
  insertUser.run(
    subscriber.id,
    subscriber.username,
    subscriber.email,
    subscriber.role,
    subHash
  );

  // Call the robust seed function for TwinStack
  seedTwinStackCoreData();
}

// ---------------------------------------------------------------------------
// Server Startup
// ---------------------------------------------------------------------------
async function startServer() {
  const appExpress = express();
  const PORT = parseInt(process.env.PORT || "3000", 10);
  const isProduction = process.env.NODE_ENV === "production";

  console.log(
    `Starting TwinStack Server (${isProduction ? "production" : "development"})...`
  );
  console.log(`Database path: ${dbPath}`);

  // Trust Railway's reverse proxy so secure cookies work behind HTTPS
  appExpress.set("trust proxy", 1);

  appExpress.use(express.json());
  appExpress.use(cookieParser());

  // ---------------------------------------------------------------------------
  // Session Store — persistent SQLite-backed sessions
  // ---------------------------------------------------------------------------
  const sessionSecret =
    process.env.SESSION_SECRET || "twinstack-dev-fallback-secret";
  if (!process.env.SESSION_SECRET && isProduction) {
    console.error(
      "🔴 FATAL: SESSION_SECRET env var is required in production!"
    );
    process.exit(1);
  }

  // Use better-sqlite3-session-store for persistent sessions
  const SqliteStore = (await import("better-sqlite3-session-store")).default(
    session
  );
  const sessionDb = new Database(path.join(dataDir, "sessions.db"));

  appExpress.use(
    session({
      store: new SqliteStore({
        client: sessionDb,
        expired: {
          clear: true,
          intervalMs: 15 * 60 * 1000, // Clean expired sessions every 15 min
        },
      }),
      name: "twinstack_sid",
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: isProduction, // true in prod (behind HTTPS), false in dev
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: isProduction ? "none" : "lax",
      },
    })
  );

  // Health check
  appExpress.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      db: "sqlite3",
      version: "1.0.0",
    });
  });

  // Seed database on startup (once — not per request)
  seedDatabase();

  // Admin repair route
  appExpress.post("/api/seed/twinstack", (req, res) => {
    const user = (req.session as any).user;
    if (!user || user.role !== "Architect") {
      return res.status(403).json({ error: "Unauthorized" });
    }
    try {
      seedTwinStackCoreData();
      res.json({
        success: true,
        message: "TwinStack seed completed by admin",
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // ---------------------------------------------------------------------------
  // Auth Routes
  // ---------------------------------------------------------------------------
  appExpress.post("/api/auth/login", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      let user: any;
      if (username) {
        user = db
          .prepare("SELECT * FROM users WHERE username = ?")
          .get(username);
      } else if (email) {
        user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      }

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const isMatch = bcrypt.compareSync(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const sessionUser = {
        uid: user.id,
        username: user.username || null,
        email: user.email || null,
        role: user.role,
      };

      (req.session as any).user = sessionUser;
      res.json({ user: sessionUser });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  appExpress.post("/api/auth/guest/signup", async (req, res) => {
    const { email, password, profile } = req.body;

    if (!email || !password || !profile) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const existing = db
        .prepare("SELECT * FROM users WHERE email = ?")
        .get(email);
      if (existing) {
        return res
          .status(400)
          .json({ error: "Account with this email already exists" });
      }

      const userId = generateId();
      const passwordHash = bcrypt.hashSync(password, 10);

      db.prepare(
        `
        INSERT INTO users (id, email, role, password_hash)
        VALUES (?, ?, ?, ?)
      `
      ).run(userId, email, "Vibecoder Guest", passwordHash);

      db.prepare(
        `
        INSERT INTO profiles (id, user_id, name, country, gender, purpose, skills, twitter, github, photo_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      ).run(
        generateId(),
        userId,
        profile.name,
        profile.country,
        profile.gender || "Prefer not to say",
        profile.purpose,
        JSON.stringify(profile.skills || []),
        profile.twitter || "",
        profile.github || "",
        profile.photoUrl || ""
      );

      const sessionUser = {
        uid: userId,
        email,
        role: "Vibecoder Guest",
      };

      (req.session as any).user = sessionUser;
      res.json({ user: sessionUser });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ error: "Registration failed" });
    }
  });

  appExpress.get("/api/auth/me", (req, res) => {
    const user = (req.session as any).user;
    if (user) {
      res.json({ user });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
  });

  appExpress.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) return res.status(500).json({ error: "Could not log out" });
      res.clearCookie("twinstack_sid");
      res.json({ success: true });
    });
  });

  // Terms Acceptance
  appExpress.post("/api/terms/accept", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    try {
      db.prepare(
        `
        INSERT INTO terms_acceptance (id, user_id, version)
        VALUES (?, ?, ?)
      `
      ).run(generateId(), user.uid, "1.0");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to record acceptance" });
    }
  });

  // ---------------------------------------------------------------------------
  // AI Restructure Endpoint — Gemini runs SERVER-SIDE only
  // ---------------------------------------------------------------------------
  appExpress.post("/api/ai/restructure", async (req, res) => {
    const user = (req.session as any).user;
    if (!user || user.role !== "Architect") {
      return res
        .status(403)
        .json({ error: "Only Architects can restructure requests" });
    }

    const { text } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Request text is required" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("GEMINI_API_KEY not configured");
      return res.status(503).json({
        error: "AI service not configured",
        nonTechDescription: text.slice(0, 250),
        techDescription: "AI unavailable — raw text preserved.",
      });
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-2.0-flash";

      const prompt = `Restructure the following request from "The Architect" to "The Builder".
Provide two versions:
1. Non-technical: A clear summary of WHAT is requested (max 250 characters).
2. Technical: A clear summary of HOW to implement it technically (max 250 characters).

User Request: "${text}"`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nonTech: {
                type: Type.STRING,
                description: "Non-technical description",
              },
              tech: {
                type: Type.STRING,
                description: "Technical description",
              },
            },
            required: ["nonTech", "tech"],
          },
        },
      });

      const result = JSON.parse(response.text || "{}");
      res.json({
        nonTechDescription: result.nonTech?.slice(0, 250) || "",
        techDescription: result.tech?.slice(0, 250) || "",
      });
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "AI processing failed",
        nonTechDescription: "Error processing request.",
        techDescription: "Error processing request.",
      });
    }
  });

  // ---------------------------------------------------------------------------
  // Projects API
  // ---------------------------------------------------------------------------
  appExpress.get("/api/projects", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    try {
      const projects = db
        .prepare(
          `
        SELECT 
          id, slug, title, description, owner, type, visibility, 
          status, created_by_role as createdByRole, 
          is_public_global_project as isPublicGlobalProject,
          always_visible as alwaysVisible,
          architect_id as architectId, 
          created_at as createdAt 
        FROM projects 
        WHERE is_public_global_project = 1 OR slug = 'twinstack' OR owner = ? OR architect_id = ? OR ? = 'Architect' OR ? = 'Builder'
        ORDER BY always_visible DESC, created_at DESC
      `
        )
        .all(user.uid, user.uid, user.role, user.role);

      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  appExpress.post("/api/projects", (req, res) => {
    const user = (req.session as any).user;
    if (
      !user ||
      (user.role !== "Architect" && user.role !== "Subscribed User")
    ) {
      return res.status(403).json({ error: "Unauthorized role" });
    }

    const { title, description, visibility } = req.body;
    if (!title || typeof title !== "string" || !title.trim()) {
      return res.status(400).json({ error: "Project title is required" });
    }

    try {
      const id = generateId();
      db.prepare(
        `
        INSERT INTO projects (id, slug, title, description, owner, type, visibility, status, created_by_role, is_public_global_project, always_visible, architect_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `
      ).run(
        id,
        title.trim().toLowerCase().replace(/\s+/g, "-"),
        title.trim(),
        description || "",
        user.role === "Architect" ? "Parallax Studio" : "Private User",
        "concept",
        visibility || "public",
        "active",
        user.role,
        0,
        0,
        user.uid
      );

      const project = db
        .prepare(
          `
        SELECT 
          id, slug, title, description, owner, type, visibility, 
          status, created_by_role as createdByRole, 
          is_public_global_project as isPublicGlobalProject,
          always_visible as alwaysVisible,
          architect_id as architectId, 
          created_at as createdAt 
        FROM projects 
        WHERE id = ?
      `
        )
        .get(id);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  appExpress.get("/api/projects/:projectId", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    try {
      const project = db
        .prepare(
          `
        SELECT 
          id, slug, title, description, owner, type, visibility, 
          status, created_by_role as createdByRole, 
          is_public_global_project as isPublicGlobalProject,
          always_visible as alwaysVisible,
          architect_id as architectId, 
          created_at as createdAt 
        FROM projects 
        WHERE id = ? OR slug = ?
      `
        )
        .get(req.params.projectId, req.params.projectId);
      if (!project)
        return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // ---------------------------------------------------------------------------
  // Requests API
  // ---------------------------------------------------------------------------
  appExpress.get("/api/projects/:projectId/requests", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });

    try {
      const project: any = db
        .prepare("SELECT id FROM projects WHERE id = ? OR slug = ?")
        .get(req.params.projectId, req.params.projectId);
      if (!project)
        return res.status(404).json({ error: "Project not found" });

      const requests = db
        .prepare(
          `
        SELECT 
          id, project_id as projectId, 
          non_tech_description as nonTechDescription, 
          tech_description as techDescription, 
          status, timestamp, implemented
        FROM requests 
        WHERE project_id = ? 
        ORDER BY timestamp DESC
      `
        )
        .all(project.id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  appExpress.post("/api/projects/:projectId/requests", (req, res) => {
    const user = (req.session as any).user;
    if (!user || user.role !== "Architect")
      return res
        .status(403)
        .json({ error: "Only Architects can create requests" });

    const { nonTechDescription, techDescription } = req.body;
    if (!nonTechDescription || !techDescription) {
      return res.status(400).json({ error: "Descriptions are required." });
    }

    try {
      const project: any = db
        .prepare("SELECT id FROM projects WHERE id = ? OR slug = ?")
        .get(req.params.projectId, req.params.projectId);
      if (!project)
        return res.status(404).json({ error: "Project not found" });

      const id = generateId();
      db.prepare(
        `
        INSERT INTO requests (id, project_id, non_tech_description, tech_description, status)
        VALUES (?, ?, ?, ?, ?)
      `
      ).run(id, project.id, nonTechDescription, techDescription, "approved");

      const requestItem = db
        .prepare(
          `
        SELECT 
          id, project_id as projectId, 
          non_tech_description as nonTechDescription, 
          tech_description as techDescription, 
          status, timestamp, implemented
        FROM requests 
        WHERE id = ?
      `
        )
        .get(id);
      res.json(requestItem);
    } catch (error) {
      console.error("Failed to create request:", error);
      res.status(500).json({ error: "Failed to create request" });
    }
  });

  appExpress.patch("/api/requests/:requestId", (req, res) => {
    const user = (req.session as any).user;
    if (!user || (user.role !== "Architect" && user.role !== "Builder")) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const { status } = req.body;
    const validStatuses = ["pending", "draft", "approved", "in_progress", "done", "rejected"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    try {
      const existing = db
        .prepare("SELECT id FROM requests WHERE id = ?")
        .get(req.params.requestId);
      if (!existing) {
        return res.status(404).json({ error: "Request not found" });
      }

      db.prepare("UPDATE requests SET status = ? WHERE id = ?").run(
        status,
        req.params.requestId
      );
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  // ---------------------------------------------------------------------------
  // Vite middleware (dev) or static files (prod)
  // ---------------------------------------------------------------------------
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    appExpress.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    appExpress.use(express.static(distPath));
    appExpress.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  appExpress.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
