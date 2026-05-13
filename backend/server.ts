import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import session from "express-session";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import Database from "better-sqlite3";

// Initialize SQLite Database
const db = new Database("twinstack.db");

// Helper for UUID-like IDs
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

// Create Tables
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
    title TEXT NOT NULL,
    description TEXT,
    owner TEXT,
    visibility TEXT DEFAULT 'public',
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

function seedDatabase() {
  console.log("Seeding Database...");
  
  const architect = {
    id: "architect-id",
    username: "architect",
    role: "Architect",
    password: "TwinStack_Architect!2026_Parallax#Orbit"
  };
  
  const builder = {
    id: "builder-id",
    username: "builder",
    role: "Builder",
    password: "TwinStack_Builder!2026_Forge#Vertex"
  };

  const insertUser = db.prepare(`
    INSERT OR IGNORE INTO users (id, username, role, password_hash)
    VALUES (?, ?, ?, ?)
  `);

  for (const user of [architect, builder]) {
    const hash = bcrypt.hashSync(user.password, 10);
    insertUser.run(user.id, user.username, user.role, hash);
  }

  // Seed default project
  const insertProject = db.prepare(`
    INSERT OR IGNORE INTO projects (id, title, description, owner, visibility, architect_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertProject.run(
    "twinstack-default",
    "TwinStack",
    "Build-in-public project by Parallax Studio",
    "Parallax Studio",
    "build-in-public",
    "architect-id"
  );
}

async function startServer() {
  const appExpress = express();
  const PORT = 3000;

  console.log("Starting TwinStack Native Server...");

  appExpress.use(express.json());
  appExpress.use(cookieParser());
  appExpress.use(session({
    name: "twinstack_sid",
    secret: "twinstack-production-auth-secret-keys-parallax", // Native secret, no prompt
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      sameSite: "lax"
    }
  }));

  // Health check
  appExpress.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(), 
      db: "sqlite3",
      version: "1.0.0"
    });
  });

  // Seed database on startup
  seedDatabase();

  // Auth Routes
  appExpress.post("/api/auth/login", async (req, res) => {
    const { username, email, password } = req.body;
    try {
      let user;
      if (username) {
        user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
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
        role: user.role
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
      const existing = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
      if (existing) {
        return res.status(400).json({ error: "Account with this email already exists" });
      }

      const userId = generateId();
      const passwordHash = bcrypt.hashSync(password, 10);
      
      db.prepare(`
        INSERT INTO users (id, email, role, password_hash)
        VALUES (?, ?, ?, ?)
      `).run(userId, email, "Vibecoder Guest", passwordHash);

      db.prepare(`
        INSERT INTO profiles (id, user_id, name, country, gender, purpose, skills, twitter, github, photo_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
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
        role: "Vibecoder Guest"
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
      db.prepare(`
        INSERT INTO terms_acceptance (id, user_id, version)
        VALUES (?, ?, ?)
      `).run(generateId(), user.uid, "1.0");
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to record acceptance" });
    }
  });

  // Projects API
  appExpress.get("/api/projects", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    
    try {
      const projects = db.prepare(`
        SELECT 
          id, title, description, owner, visibility, 
          architect_id as architectId, 
          created_at as createdAt 
        FROM projects 
        ORDER BY created_at DESC
      `).all();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  appExpress.post("/api/projects", (req, res) => {
    const user = (req.session as any).user;
    if (!user || user.role !== "Architect") return res.status(403).json({ error: "Only Architects can create projects" });
    
    const { title, description, visibility } = req.body;
    try {
      const id = generateId();
      db.prepare(`
        INSERT INTO projects (id, title, description, owner, visibility, architect_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(id, title, description, "Parallax Studio", visibility, user.uid);
      
      const project = db.prepare(`
        SELECT 
          id, title, description, owner, visibility, 
          architect_id as architectId, 
          created_at as createdAt 
        FROM projects 
        WHERE id = ?
      `).get(id);
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to create project" });
    }
  });

  appExpress.get("/api/projects/:projectId", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    
    try {
      const project = db.prepare(`
        SELECT 
          id, title, description, owner, visibility, 
          architect_id as architectId, 
          created_at as createdAt 
        FROM projects 
        WHERE id = ?
      `).get(req.params.projectId);
      if (!project) return res.status(404).json({ error: "Project not found" });
      res.json(project);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  // Requests API
  appExpress.get("/api/projects/:projectId/requests", (req, res) => {
    const user = (req.session as any).user;
    if (!user) return res.status(401).json({ error: "Not authenticated" });
    
    try {
      const requests = db.prepare(`
        SELECT 
          id, project_id as projectId, 
          non_tech_description as nonTechDescription, 
          tech_description as techDescription, 
          status, timestamp 
        FROM requests 
        WHERE project_id = ? 
        ORDER BY timestamp DESC
      `).all(req.params.projectId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  appExpress.post("/api/projects/:projectId/requests", (req, res) => {
    const user = (req.session as any).user;
    if (!user || user.role !== "Architect") return res.status(403).json({ error: "Only Architects can create requests" });
    
    const { nonTechDescription, techDescription } = req.body;
    try {
      const id = generateId();
      db.prepare(`
        INSERT INTO requests (id, project_id, non_tech_description, tech_description, status)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, req.params.projectId, nonTechDescription, techDescription, "pending");
      
      const requestItem = db.prepare(`
        SELECT 
          id, project_id as projectId, 
          non_tech_description as nonTechDescription, 
          tech_description as techDescription, 
          status, timestamp 
        FROM requests 
        WHERE id = ?
      `).get(id);
      res.json(requestItem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create request" });
    }
  });

  appExpress.patch("/api/requests/:requestId", (req, res) => {
    const user = (req.session as any).user;
    if (!user || (user.role !== "Architect" && user.role !== "Builder")) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    
    const { status } = req.body;
    try {
      db.prepare("UPDATE requests SET status = ? WHERE id = ?").run(status, req.params.requestId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to update request" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    appExpress.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    appExpress.use(express.static(distPath));
    appExpress.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  appExpress.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
