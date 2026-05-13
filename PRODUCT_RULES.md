# Product Rules (PRODUCT_RULES.md)

## Exact App Scope
TwinStack is a specialized workflow tool for high-velocity duo studios. It is NOT a generalized project management tool like Jira or Asana. It strictly enforces the Architect → Builder execution methodology.

## Allowed Features
- Real-time request tracking
- Strict technical/non-technical separation
- Read-only observer mode
- Subscribed private workspaces

## Forbidden Features
- KanBan boards or extensive status tagging beyond the simplistic workflow
- Multi-user "assignee" mechanics (there is only one Builder by design)
- Generalized commenting threads (prevents bikeshedding)

## MVP Boundaries
- The MVP requires fully functioning auth, accurate role access validation, and robust session persistence. 
- UI must remain minimalist.

## Future Features Parking Lot
- Advanced branch/fork mechanics for Vibecoders.
- Deep Stripe API webhooks for automated lifecycle actions.
- Real-time sockets for instantaneous updates.

## No-Feature-Creep Rule
Agents must absolutely not implement new logic or features outside of explicit requests by the product owner. Stability and role precision takes precedence over adding more buttons.
