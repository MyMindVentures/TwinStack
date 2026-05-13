# Architecture (ARCHITECTURE.md)

## Frontend structure
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **Animations**: `motion/react`
- **Routing**: React Router (`react-router-dom`)
- **State**: React Context or local component state
- **Pages**: Dashboard, ProjectView, Login, Landing, VibecoderSetup, Terms

## Backend/database structure
- **Server**: Node.js with Express (`server.ts`)
- **Database**: SQLite (`better-sqlite3`)
- **Structure**: Monolithic full-stack setup with a single Express server running Vite in development middleware mode and serving static files in production.

## Auth flow
- **Internal**: Architects and Builders login via seeded credentials and internal login path.
- **External/Guests**: Vibecoder Guests register, accept Terms, set up a profile, and log in.
- **Subscribers**: Subscribed Users log in to access private workspaces.
- All auth uses sessions managed by `express-session` backed by a SQLite store (`connect-sqlite3`).

## Role permissions
- `Architect`: Full write access
- `Builder`: Queue execution access
- `Vibecoder Guest`: Read-only access to global public projects (TwinStack)
- `Subscribed User`: Write access to their own projects, read access to global public projects.

## Project/request data model
- **Projects**: Core container for a product. TwinStack is seeded as `is_public_global_project=1`.
- **Requests**: Units of work inside a project containing `non_tech_description` and `tech_description`.

## Guest onboarding flow
1. User chooses Vibecoder Guest on the Login page.
2. User is redirected to accept Terms.
3. User completes Profile setup (VibecoderSetup).
4. User gains read-only access to TwinStack.

## Subscription flow
1. Users view the Landing page with pricing.
2. They select the Creator Plan.
3. (Stripe integration planned) Upon success, they are granted the `Subscribed User` role.

## PWA setup
- Application should be fully responsive.
- Designed with mobile-first precision.
- Can be installed as a PWA (manifest + service worker architecture constraints apply).

## Deployment assumptions
- Containerized via Docker.
- Port 3000 exposed via nginx.
- Environment variables injected securely (e.g. `SESSION_SECRET`, `NODE_ENV`).
