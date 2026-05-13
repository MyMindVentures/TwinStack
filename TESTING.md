# Testing Guidelines (TESTING.md)

## Manual QA Checklist
- Verify landing page interactions.
- Verify terms and conditions acceptance flow.
- Ensure correct display of dashboard based on roles.
- Ensure responsive layout behaves correctly on mobile/tablet.

## Smoke Tests
- Application starts up correctly without crashing.
- Database seeds successfully.
- Root path `/` redirects correctly based on auth state.

## Role-based Tests
- **Architect**: Can create projects and requests.
- **Builder**: Can view requests but cannot create projects.
- **Vibecoder Guest**: Read-only access to TwinStack.
- **Subscribed User**: Can view TwinStack, and can create private projects.

## Auth Tests
- Login works for all 4 roles.
- Logout successfully invalidates sessions.
- Reloading the page maintains the session.

## Database Tests
- TwinStack project is never duplicated.
- Validations block malformed request insertions.
- Private projects are only visible to their owners (and Architects).

## Mobile/Tablet Tests
- Splitview gracefully degrades into stacked/tabbed view on smaller screens.
- Navigation elements remain accessible via touch.

## PWA Tests
- Manifest is correctly referenced.
- Offline fallback page works (if configured).

## Payment Tests
- Stripe checkout integration properly routes user and upgrades role status.

## Guest Onboarding Tests
- Guest registration enforces T&C acceptance.
- Guest profile setup is correctly saved before dashboard access is permitted.
