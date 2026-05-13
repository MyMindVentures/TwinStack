# TwinStack Design System

TwinStack's visual identity reflects its purpose: providing a premium operating system for founders, architects, and vibecoders. It prioritizes clarity over decoration, functioning as an elite, minimal, but powerful engineering tool.

## Philosophy
- **Elite startup software:** Feels like Linear, Vercel, Notion, Raycast.
- **Calm execution energy:** Focus on content and architecture without flashy distractions.
- **Minimal but powerful:** Let the data, text, and structure breathe.
- **Build-in-public intelligence:** Clean, professional layouts that are presentable to a global audience.

## 1. Color System (Dark Mode Foundation)
TwinStack uses a unified dark mode foundation with deep graphite backgrounds and electric blue/violet accents.

- **Background Primary (`--bg-primary`):** `#0a0a0a` - The infinite canvas (Deep graphite).
- **Background Secondary (`--bg-secondary`):** `#141414` - Elevated surfaces and containers.
- **Surface Primary (`--surface-primary`):** `#1a1a1a` - Interactive cards.
- **Surface Hover (`--surface-hover`):** `#242424` - Interactive hover state.
- **Border Subtle (`--border-subtle`):** `#27272a` - Dividers and light boundaries.
- **Border Strong (`--border-strong`):** `#3f3f46` - Form inputs and emphasized borders.
- **Text Primary (`--text-primary`):** `#fafafa` - Main readable content.
- **Text Secondary (`--text-secondary`):** `#a1a1aa` - Metadata and supporting text.
- **Text Muted (`--text-muted`):** `#71717a` - Placeholders and disabled states.
- **Accent Primary (`--accent-primary`):** `#3b82f6` - Electric blue for primary actions.
- **Accent Hover (`--accent-hover`):** `#2563eb` - Hover state for primary actions.
- **Success (`--success`):** `#10b981`
- **Warning (`--warning`):** `#f59e0b`
- **Error (`--error`):** `#ef4444`

## 2. Typography System
TwinStack requires high readability and strong modern SaaS appeal.

- **Font Family:** `Inter`, sans-serif (Precision and clarity).
- **Hierarchy:**
  - `display-xl`: 48px, semi-bold, tight tracking (-0.02em)
  - `display-lg`: 36px, semi-bold, tight tracking
  - `heading-xl`: 24px, medium
  - `heading-lg`: 20px, medium
  - `heading-md`: 16px, medium
  - `body-lg`: 16px, regular (Main content)
  - `body-md`: 14px, regular (UI labels, descriptions)
  - `body-sm`: 13px, regular (Metadata)
  - `caption`: 12px, regular
  - `label`: 11px, medium, uppercase, wide tracking (0.05em)

## 3. Spacing System
A strict spacing scale ensures consistent rhythm and eliminates visual chaos.

- `space-4` (4px)
- `space-8` (8px): Inner component spacing
- `space-12` (12px): Standard button padding
- `space-16` (16px): Card padding
- `space-20` (20px): Form groups
- `space-24` (24px): Section boundaries
- `space-32` (32px): Major layout divisions
- `space-40` (40px)
- `space-48` (48px)
- `space-64` (64px): Page headers

## 4. Motion System
TwinStack uses calm, subtle premium motion.

- **Fade Transitions:** `duration-200` with ease-out for route changes.
- **Card Hover Elevation:** A subtle shadow and border color shift, rather than bouncy scaling.
- **Notification Slide-ins:** Swift ease-out from the edge.

## 5. Layout System
- **Responsive Grid:** Up to 12 columns.
- **Mobile First, Tablet Optimized:** Information density adapts gracefully.
- **Splitview Workspace:** Core layout pattern in the dashboard. Left side (creation) fixed or scrollable, Right side (list/queue) scrollable independently.

## 6. Iconography
- **Library:** `lucide-react`.
- **Style:** Clean, thin lines, standard 16px or 20px size for UI controls, 24px for major actions.
