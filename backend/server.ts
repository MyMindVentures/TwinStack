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

  const subscriber = {
    id: "subscriber-id",
    username: "subscriber",
    email: "subscriber@example.com",
    role: "Subscribed User",
    password: "password"
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
  insertUser.run(subscriber.id, subscriber.username, subscriber.email, subscriber.role, subHash);



  // Seed default project
  const insertProject = db.prepare(`
    INSERT OR IGNORE INTO projects (id, slug, title, description, owner, type, visibility, status, created_by_role, is_public_global_project, always_visible, architect_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProject.run(
    "twinstack-default",
    "twinstack",
    "TwinStack",
    "TwinStack is the public build-in-progress project where Vibecoder Guests can follow every request, upgrade and execution step in real time.",
    "Parallax Studio",
    "build-in-public",
    "public-read",
    "active",
    "architect",
    1,
    1,
    "architect-id"
  );

  // Seed welcome request
  const insertRequest = db.prepare(`
    INSERT OR IGNORE INTO requests (id, project_id, non_tech_description, tech_description, status, timestamp, implemented)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  insertRequest.run(
    "welcome-request-twinstack",
    "twinstack-default",
    "Welcome to TwinStack build-in-public. Follow how The Architect and The Builder improve this platform in real time.",
    "Initialize default TwinStack public project with guest-readable request queue and role-based access.",
    "approved",
    new Date().toISOString(),
    1
  );

  // Seed 10 implemented features
  const featuredRequests = [
    {
      id: "feat-1",
      nonTech: "Add fixed login cards for The Architect, The Builder and Vibecoder Guest.",
      tech: "Implement role-based login entry with separate access flows for architect, builder and vibecoder guest."
    },
    {
      id: "feat-2",
      nonTech: "Add dashboard where internal users can view app projects and create new concepts.",
      tech: "Implement project dashboard with project list, active project selection and new project creation modal."
    },
    {
      id: "feat-3",
      nonTech: "Let The Architect create a new app concept with title and description.",
      tech: "Add modal with title input and 1500-character description field linked to project creation."
    },
    {
      id: "feat-4",
      nonTech: "Show request input on the left and Builder queue on the right inside each project.",
      tech: "Implement responsive splitview layout with request composer and approved request queue."
    },
    {
      id: "feat-5",
      nonTech: "Convert raw Architect requests into clear non-technical and technical descriptions.",
      tech: "Add AI structuring step returning max 250-char nonTechnicalDescription and max 250-char technicalDescription."
    },
    {
      id: "feat-6",
      nonTech: "Let The Architect approve structured requests before they appear for The Builder.",
      tech: "Add approve flow that saves approved request cards to the project queue with timestamp."
    },
    {
      id: "feat-7",
      nonTech: "Notify The Builder when a new approved request is added.",
      tech: "Implement new request popup for builder role triggered by approved request creation."
    },
    {
      id: "feat-8",
      nonTech: "Require guests to accept terms and create a profile before viewing TwinStack.",
      tech: "Add terms acceptance, guest account creation and vibecoder profile form with photo and social links."
    },
    {
      id: "feat-9",
      nonTech: "Let Vibecoder Guests follow the TwinStack project in real time without editing anything.",
      tech: "Restrict guest role to read-only access for projectSlug twinstack and show request cards with fork/branch buttons."
    },
    {
      id: "feat-10",
      nonTech: "Add a professional landing page, founder story, copyright, terms and support section.",
      tech: "Implement landing page sections, legal pages, copyright notice, terms flow and support/donation CTA."
    }
  ];

  for (const req of featuredRequests) {
    insertRequest.run(
      req.id,
      "twinstack-default",
      req.nonTech,
      req.tech,
      "approved",
      new Date().toISOString(),
      1
    );
  }
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
      secure: true, 
      httpOnly: true, 
      maxAge: 7 * 24 * 60 * 60 * 1000, 
      sameSite: "none"
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
      // Ensure TwinStack project exists
      const twinstackExists = db.prepare("SELECT id FROM projects WHERE slug = 'twinstack' OR id = 'twinstack-default'").get();
      if (!twinstackExists) {
        {
          const existingRow = db.prepare("PRAGMA table_info(projects)").all() as any[];
          const columns = existingRow.map(c => c.name);
          if (!columns.includes('is_default_public_project')) {
            db.exec(`ALTER TABLE projects ADD COLUMN is_default_public_project INTEGER DEFAULT 0;`);
          }
          if (!columns.includes('protected_from_deletion')) {
            db.exec(`ALTER TABLE projects ADD COLUMN protected_from_deletion INTEGER DEFAULT 0;`);
          }
        }

        db.prepare(`
          INSERT INTO projects (id, slug, title, description, owner, type, visibility, status, created_by_role, is_public_global_project, always_visible, architect_id, is_default_public_project, protected_from_deletion)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          "twinstack-default",
          "twinstack",
          "TwinStack",
          "TwinStack is the official build-in-public project where users can follow how Parallax Studio improves the platform in real time.",
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
      } else {
        // Force update flags on existing TwinStack project to ensure visibility
        db.prepare(`
          UPDATE projects 
          SET 
            title = 'TwinStack',
            slug = 'twinstack',
            description = 'TwinStack is the official build-in-public project where users can follow how Parallax Studio improves the platform in real time.',
            owner = 'Parallax Studio',
            type = 'build-in-public',
            visibility = 'public-read',
            status = 'active',
            is_public_global_project = 1, 
            always_visible = 1
          WHERE slug = 'twinstack' OR id = 'twinstack-default'
        `).run();
      }

      // Also seed the 10 requests if missing
      const requestCount = db.prepare("SELECT COUNT(*) as count FROM requests WHERE project_id = 'twinstack-default'").get();
      if ((requestCount as any).count === 0) {
        const insertRequest = db.prepare(`
          INSERT OR IGNORE INTO requests (id, project_id, non_tech_description, tech_description, status, timestamp, implemented)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        insertRequest.run(
          "welcome-request-twinstack",
          "twinstack-default",
          "Welcome to TwinStack build-in-public. Follow how The Architect and The Builder improve this platform in real time.",
          "Initialize default TwinStack public project with guest-readable request queue and role-based access.",
          "approved",
          new Date().toISOString(),
          1
        );

        const featuredRequests = [
          { id: "feat-1", nonTech: "Add fixed login cards for The Architect, The Builder and Vibecoder Guest.", tech: "Implement role-based login entry with separate access flows for architect, builder and vibecoder guest." },
          { id: "feat-2", nonTech: "Add dashboard where internal users can view app projects and create new concepts.", tech: "Implement project dashboard with project list, active project selection and new project creation modal." },
          { id: "feat-3", nonTech: "Let The Architect create a new app concept with title and description.", tech: "Add modal with title input and 1500-character description field linked to project creation." },
          { id: "feat-4", nonTech: "Show request input on the left and Builder queue on the right inside each project.", tech: "Implement responsive splitview layout with request composer and approved request queue." },
          { id: "feat-5", nonTech: "Convert raw Architect requests into clear non-technical and technical descriptions.", tech: "Add AI structuring step returning max 250-char nonTechnicalDescription and max 250-char technicalDescription." },
          { id: "feat-6", nonTech: "Let The Architect approve structured requests before they appear for The Builder.", tech: "Add approve flow that saves approved request cards to the project queue with timestamp." },
          { id: "feat-7", nonTech: "Notify The Builder when a new approved request is added.", tech: "Implement new request popup for builder role triggered by approved request creation." },
          { id: "feat-8", nonTech: "Require guests to accept terms and create a profile before viewing TwinStack.", tech: "Add terms acceptance, guest account creation and vibecoder profile form with photo and social links." },
          { id: "feat-9", nonTech: "Let Vibecoder Guests follow the TwinStack project in real time without editing anything.", tech: "Restrict guest role to read-only access for projectSlug twinstack and show request cards with fork/branch buttons." },
          { id: "feat-10", nonTech: "Add a professional landing page, founder story, copyright, terms and support section.", tech: "Implement landing page sections, legal pages, copyright notice, terms flow and support/donation CTA." }
        ];

        for (const req of featuredRequests) {
          insertRequest.run(req.id, "twinstack-default", req.nonTech, req.tech, "approved", new Date().toISOString(), 1);
        }
      }

      const projects = db.prepare(`
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
      `).all(user.uid, user.uid, user.role, user.role);

      res.json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  appExpress.post("/api/projects", (req, res) => {
    const user = (req.session as any).user;
    if (!user || (user.role !== "Architect" && user.role !== "Subscribed User")) {
      return res.status(403).json({ error: "Unauthorized role" });
    }
    
    const { title, description, visibility } = req.body;
    try {
      const id = generateId();
      db.prepare(`
        INSERT INTO projects (id, slug, title, description, owner, type, visibility, status, created_by_role, is_public_global_project, always_visible, architect_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(id, title.toLowerCase().replace(/\s+/g, '-'), title, description, user.role === "Architect" ? "Parallax Studio" : "Private User", "concept", visibility, "active", user.role, 0, 0, user.uid);


      
      const project = db.prepare(`
        SELECT 
          id, slug, title, description, owner, type, visibility, 
          status, created_by_role as createdByRole, 
          is_public_global_project as isPublicGlobalProject,
          always_visible as alwaysVisible,
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
          id, slug, title, description, owner, type, visibility, 
          status, created_by_role as createdByRole, 
          is_public_global_project as isPublicGlobalProject,
          always_visible as alwaysVisible,
          architect_id as architectId, 
          created_at as createdAt 
        FROM projects 
        WHERE id = ? OR slug = ?
      `).get(req.params.projectId, req.params.projectId);
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
      const project: any = db.prepare("SELECT id FROM projects WHERE id = ? OR slug = ?").get(req.params.projectId, req.params.projectId);
      if (!project) return res.status(404).json({ error: "Project not found" });

      const requests = db.prepare(`
        SELECT 
          id, project_id as projectId, 
          non_tech_description as nonTechDescription, 
          tech_description as techDescription, 
          status, timestamp, implemented
        FROM requests 
        WHERE project_id = ? 
        ORDER BY timestamp DESC
      `).all(project.id);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch requests" });
    }
  });

  appExpress.post("/api/projects/:projectId/requests", (req, res) => {
    const user = (req.session as any).user;
    if (!user || user.role !== "Architect") return res.status(403).json({ error: "Only Architects can create requests" });
    
    const { nonTechDescription, techDescription } = req.body;
    if (!nonTechDescription || !techDescription) {
       return res.status(400).json({ error: "Descriptions are required." });
    }

    try {
      const project: any = db.prepare("SELECT id FROM projects WHERE id = ? OR slug = ?").get(req.params.projectId, req.params.projectId);
      if (!project) return res.status(404).json({ error: "Project not found" });

      const id = generateId();
      db.prepare(`
        INSERT INTO requests (id, project_id, non_tech_description, tech_description, status)
        VALUES (?, ?, ?, ?, ?)
      `).run(id, project.id, nonTechDescription, techDescription, "pending");

      
      const requestItem = db.prepare(`
        SELECT 
          id, project_id as projectId, 
          non_tech_description as nonTechDescription, 
          tech_description as techDescription, 
          status, timestamp, implemented
        FROM requests 
        WHERE id = ?
      `).get(id);
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
