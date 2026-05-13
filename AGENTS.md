# TwinStack Agent Guidelines (AGENTS.md)

## Product Purpose
TwinStack is a proprietary product execution platform created by **Parallax Studio**. It bridges the gap between vision and execution, providing a structured environment where an Architect structures the product and a Builder executes the roadmap—all while the community observes and collaborates as Vibecoder Guests.

## Core App Concept
The app provides a strictly separated role-based workflow:
- The **Architect** defines the product vision, non-technical requirements, and technical specifications.
- The **Builder** takes these specs and converts them into production-ready code.
- **TwinStack** acts as the global, build-in-public showcase project for Parallax Studio.

## Non-Negotiable Rules
- **Do not rebuild TwinStack from scratch.**
- **Do not change the core Architect → Builder workflow.**
- **Do not remove the TwinStack seeded project.**
- **Do not remove the implemented request cards.**
- **Do not add features unless explicitly requested.**
- **Do not introduce Firebase unless explicitly approved** (we are using SQLite by default currently).
- **Do not add new secrets or env variables unless absolutely required.**
- **Do not break mobile/tablet layout.**
- **Do not modify legal/copyright protection without permission.**
- **Always preserve role-based access.**
- **Always run tests before final response.**
- **Always document what changed.**

## Role Permissions
- **The Architect:** Full access. Can create/edit/approve requests, manage TwinStack project.
- **The Builder:** Can view and manage the Builder queue, receive request notifications, update implementation states.
- **Vibecoder Guest:** Read-only access. Can follow all requests in real time. Can use placeholder features (Fork TwinStack, Create Branch).
- **Subscribed User:** Can view TwinStack publicly. Can create their own private projects/workspaces through their subscription.

## Database Rules
- The `twinstack` project must always be marked as `is_public_global_project: 1` and `always_visible: 1`.
- It must automatically be included in dashboard queries for all authenticated users.
- Prevent accidental deletion of the TwinStack project.

## UI Rules
- TwinStack must be shown as "Official Build-in-Public Project".
- It should be highlighted/pinned as a project card.
- Maintain minimalist, high-performance UI designed for productivity.

## Legal Rules
- TwinStack is proprietary software owned by Parallax Studio.
- Ensure Terms & Conditions, Copyright notices, and Anti-copycat notices remain visible and enforced.
- Do not expose private secrets or allow unauthorized role access.

## Testing Rules
- Every fix must be verified.
- Ensure no empty or broken database states.
- Run smoke tests, auth tests, role-based tests, and layout responsiveness tests after changes.

## Deployment Rules
- Must remain stable and production-ready at all times.
- Must not introduce crashes on startup.

## Forbidden Actions
- Deleting the `twinstack.db` seeding logic without permission.
- Changing the primary application architecture (e.g., ripping out Express for Next.js without explicit user request).
- Introducing feature creep.
