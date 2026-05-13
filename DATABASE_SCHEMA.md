# Database Schema (DATABASE_SCHEMA.md)

_Note: This documents the SQLite schema in `server.ts`._

## `users`
- `id` (TEXT PRIMARY KEY)
- `username` (TEXT UNIQUE NOT NULL)
- `email` (TEXT UNIQUE)
- `role` (TEXT NOT NULL)
- `password_hash` (TEXT NOT NULL)
- `created_at` (DATETIME)

## `sessions`
- Handled by `connect-sqlite3`

## `projects`
- `id` (TEXT PRIMARY KEY)
- `slug` (TEXT UNIQUE NOT NULL)
- `title` (TEXT NOT NULL)
- `description` (TEXT)
- `owner` (TEXT)
- `type` (TEXT)
- `visibility` (TEXT DEFAULT 'public')
- `status` (TEXT)
- `created_by_role` (TEXT)
- `is_public_global_project` (INTEGER DEFAULT 0)
- `always_visible` (INTEGER DEFAULT 0)
- `architect_id` (TEXT, FK -> users.id)
- `created_at` (DATETIME)

## `requests`
- `id` (TEXT PRIMARY KEY)
- `project_id` (TEXT NOT NULL, FK -> projects.id)
- `non_tech_description` (TEXT NOT NULL)
- `tech_description` (TEXT NOT NULL)
- `status` (TEXT DEFAULT 'pending')
- `implemented` (INTEGER DEFAULT 0)
- `timestamp` (DATETIME)

## `vibecoder_profiles`
- Planned/Implicitly handled through `users` or additional tables when profiles are fully expanded. Current implementation stores user fields.

## `terms_acceptance`
- (Can be added to user records: `accepted_terms INTEGER DEFAULT 0`)

## `subscriptions` / `forks` / `branches`
- Future schemas based on architectural plans.

## Required Seeded Data
- **TwinStack Project**: 
  - `slug`: `twinstack`
  - `title`: `TwinStack`
  - `is_public_global_project`: `1`
  - `always_visible`: `1`
- **10 Implemented Request Cards**: Pre-seeded in `twinstack.db` initialization.
- **Architect internal user**: Seeded on startup.
- **Builder internal user**: Seeded on startup.
- **Subscriber test user**: Seeded on startup.
