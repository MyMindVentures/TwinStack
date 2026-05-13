# 🛸 TwinStack

**The Build-in-Public Workflow Engine for High-Velocity Duo Studios.**

TwinStack is a proprietary product execution platform created by **Parallax Studio**. It bridges the gap between vision and execution, providing a structured environment where an Architect structures the product and a Builder executes the roadmap—all while the community observes and collaborates as Vibecoder Guests.

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
- **Minimalist Dashboard**: Focused, high-performance UI designed for productivity.
- **Mobile-First Precision**: Fully optimized for the modern, multi-device developer.
- **Build-in-Public**: Transparent execution logs for community trust.

---

## 💻 Tech Stack
- **Frontend**: React 18+ (Vite), Tailwind CSS, Framer Motion (motion/react).
- **Backend**: Node.js (Express) via `server.ts`.
- **Database**: Firebase (Firestore) with ABAC Security Rules.
- **Auth**: Firebase Authentication (Google & Internal Staff).

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
   # Add your Firebase credentials
   ```

### Execution
- **Development**: `npm run dev`
- **Build**: `npm run build`
- **Production Start**: `npm run start`

---

## 📁 Repository Structure
- `src/`: Core React application logic.
  - `components/`: Reusable UI components.
  - `pages/`: Route-level page components.
  - `services/`: API and Firebase service logic.
  - `hooks/`: Custom React hooks.
  - `types/`: TypeScript interfaces and enums.
- `server.ts`: Express backend server.
- `database/`: Firestore security rules and blueprints.
- `docs/`: Supplementary documentation.
- `legal/`: Legal documents (Terms, License).

---

## 📄 License
© 2026 Parallax Studio. Proprietary Software.
TwinStack is a closed-source product built in a public-visibility environment. See `LICENSE.md` for full terms.

## 🤝 Contact
- **Studio**: Parallax Studio
- **Twitter**: [@ParallaxStudio](https://twitter.com)
- **GitHub**: [github.com/parallax-studio](https://github.com/parallax-studio)
