# Component Guidelines

TwinStack components must feel operational, fast, and highly predictable.

## Buttons
- **Primary:** Electric blue background (`bg-accent-primary`), white text. Used for main actions (e.g., "Submit Request"). No shadows, slight brightness on hover.
- **Secondary:** Dark surface (`bg-surface-primary`), strong border (`border-strong`), white text. Used for alternative actions.
- **Ghost:** Transparent background, white text on hover. For tertiary actions.
- **Destructive:** Error color background or ghost red for deletion.

## Inputs
- **Base:** `bg-bg-secondary`, `border-subtle`, rounded-md, `text-primary`.
- **Focus:** Change border to `accent-primary`, add subtle glow/ring using `ring-accent-primary/20`.
- **Textarea:** Same as base input; allow vertical resize only. Padding 12px.

## Cards
- **Project/Request Card:** Use `bg-surface-primary`, `border-subtle`, `rounded-xl`, `p-16` spacing.
- **Hover:** Border shifts to `border-strong` or `border-zinc-700`, `bg-surface-hover`. Transition smoothly (`duration-200 ease-out`).
- **Data Display:** Use mono fonts for tags like IDs (e.g., `REQ-3829`).

## Modals
- **Backdrop:** `bg-black/60` with a subtle blur `backdrop-blur-sm`.
- **Container:** `bg-bg-primary` or `bg-surface-primary`, rounded-2xl, strong border (`border-strong`), subtle inner shadow or drop shadow to create elevation.
- **Structure:** Clear header (24px padding), body (content), footer (actions right-aligned).

## States
- **Loading:** Use skeleton loaders instead of spinners where possible. Low opacity pulsing.
- **Empty:** Center-aligned, muted text, subtle icon, and clear call-to-action placed in a `space-32` container.
- **Success:** Subtle green accents (don't overwhelm the UI with dark backgrounds and bright text).
- **Disabled:** 50% opacity, `cursor-not-allowed`, no hover effects.
