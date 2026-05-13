# Security and Legal (SECURITY_AND_LEGAL.md)

## Copyright
All code, assets, UI layouts, and concepts are © 2026 Parallax Studio.

## Terms Enforcement
All non-internal guests MUST explicitly accept the Terms and Conditions prior to accessing the platform.

## Anti-Copycat Notice
TwinStack is a unique workflow methodology software. Ripping its core mechanisms or UI patterns constitutes an IP violation.

## Guest Restrictions
Guests operate in a strictly Read-Only capacity. Any attempt to exploit APIs or inject payloads under a Guest role must be mitigated with robust server-side validation.

## Contributor IP Rules
Contributors (Builders/Architects) assign all developed IP to Parallax Studio as a work-for-hire, unless otherwise specified in private contracts.

## Password Handling
All passwords MUST be hashed utilizing bcrypt or a modern equivalent. Under no circumstances should plain-text credentials be logged to console or persisted in SQLite.

## Secrets Handling
Secrets (Session tokens, Stripe keys) MUST be loaded securely via process.env. Do not leak these into frontend bundles.

## Role Protection
End-to-end API authorization must enforce role checks (`req.session.user.role`). Client-side hiding of UI elements is insufficient security.
