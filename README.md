# 🛸 TwinStack

**The Build-in-Public Workflow Engine for High-Velocity Duo Studios.**

> ⚠️ **IMPORTANT WARNING FOR AI CODING AGENTS** ⚠️
> **Before contributing or using an AI coding agent, read [AGENTS.md](./AGENTS.md) first!**
> TwinStack is proprietary software owned by Parallax Studio. Do not rebuild, alter core concepts, or introduce unrequested features.

TwinStack is a proprietary product execution platform created by **Parallax Studio**. It bridges the gap between vision and execution, providing a structured environment where an Architect structures the product and a Builder executes the roadmap—all while the community observes and collaborates as Vibecoder Guests.

---

## 📚 Documentation
Please review the strict guidelines and architecture before working on this project:
- [AGENTS.md](./AGENTS.md) - Main instruction file for every AI coding agent.
- [PROJECT_BRIEF.md](./PROJECT_BRIEF.md) - Product motivation and workflows.
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture and setup.
- [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md) - SQLite definitions.
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Visual identity and design tokens.
- [PRODUCT_RULES.md](./PRODUCT_RULES.md) - Product boundaries and feature scopes.
- [SECURITY_AND_LEGAL.md](./SECURITY_AND_LEGAL.md) - Copyright and role protection.
- [TESTING.md](./TESTING.md) - QA Checklists and testing methodologies.
- [CHANGELOG.md](./CHANGELOG.md) - Progression and release history.

---

## 🏛 Vision
TwinStack is built on the philosophy that **clarity is speed**. By strictly separating the architectural structure from the execution layer, we eliminate middle-manager overhead and focus entirely on high-fidelity shipping.

## 🛠 Core Workflow
1. **The Architect** defines the product vision, non-technical requirements, and technical specifications.
2. **The Builder** takes these specifications and converts them into production-ready code.
3. **The Request** serves as the atomic unit of work, tracked in real-time through its lifecycle.
4. **Vibecoder Guests** observe the build-in-public stream and can fork ideas into their own workspace.

## 👥 User Roles
| Role | Responsibility | Access Level |
| :--- | :--- | :--- |
| **The Architect** | Product structure, specifications, strategy. | Admin / Full Write |
| **The Builder** | Implementation, engineering, performance. | Admin / Full Write |
| **Vibecoder Guest** | Observation, community contribution, forking. | Read-Only (Public Projects) |

## 🚀 Key Features
- **Project Pulse**: Real-time request tracking and status updates.
- **Architectural Specs**: Detailed non-tech and technical requirement pairing.
- **AI Restructuring**: Gemini-powered conversion of raw ideas into structured specs.
- **Minimalist Dashboard**: Focused, high-performance UI designed for productivity.
- **Mobile-First Precision**: Fully optimized for the modern, multi-device developer.
- **Build-in-Public**: Transparent execution logs for community trust.

---

## 💻 Tech Stack
- **Frontend**: React 19 (Vite 6), Tailwind CSS 4, `motion/react`, `lucide-react`.
- **Backend**: Node.js (Express 4) via `backend/server.ts`.
- **Database**: SQLite (`better-sqlite3`) with session persistence.
- **Auth**: Session-based authentication (`express-session` + `bcryptjs`).
- **AI**: Google Gemini API (`@google/genai`) for request restructuring.

---

## 🛠 Local Development Setup

### Prerequisites
- Node.js 18+
- npm 10+

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/parallax-studio/twinstack.git
   cd twinstack
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```

### Execution
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Production Start**: `npm run start`

---

## 🚀 Railway Deployment

### 1. Create a Railway Project
- Connect your GitHub repository in the Railway dashboard.
- Railway will auto-detect the Node.js setup and use `railway.json`.

### 2. Attach a Persistent Volume
- In your Railway service settings, add a **Volume**.
- Set the mount path to `/data` (or any path you prefer).
- This ensures `twinstack.db` and `sessions.db` persist across deploys.

### 3. Set Environment Variables
In the Railway dashboard, add these required variables:

| Variable | Required | Description |
| :--- | :--- | :--- |
| `SESSION_SECRET` | ✅ | Random 64+ character string for signing cookies |
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `ARCHITECT_PASSWORD` | ✅ | Secure password for the Architect role |
| `BUILDER_PASSWORD` | ✅ | Secure password for the Builder role |
| `SUBSCRIBER_PASSWORD` | Optional | Subscriber test account password |
| `NODE_ENV` | Auto | Set to `production` by Railway |
| `PORT` | Auto | Injected by Railway |

### 4. Deploy
Railway will automatically build and deploy. The app will be available at your Railway-generated domain.

---

## 📁 Repository Structure
- `src/`: Core React application logic.
  - `components/`: Reusable UI components (ErrorBoundary, etc.).
  - `pages/`: Route-level page components.
  - `services/`: API and AI service logic.
  - `hooks/`: Custom React hooks.
  - `types/`: TypeScript interfaces and enums.
  - `lib/`: Utility functions.
- `backend/server.ts`: Express backend server + SQLite database.
- `database/`: Schema documentation and blueprints.
- `legal/`: Legal documents (Terms, License).

---

## 📄 License
© 2026 Parallax Studio. Proprietary Software.
TwinStack is a closed-source product built in a public-visibility environment. See `LICENSE.md` for full terms.

## 🤝 Contact
- **Studio**: Parallax Studio
- **Twitter**: [@ParallaxStudio](https://twitter.com)
- **GitHub**: [github.com/parallax-studio](https://github.com/parallax-studio)
