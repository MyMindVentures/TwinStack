# UI Rules & Quality Enforcement

To maintain TwinStack's elite profile, adhere strictly to the following UI rules. Avoid any "AI-generated demo" feelings.

## 1. No Inconsistent Border Radius
- Use `rounded-md` (6px) for small interactive elements (inputs, standard buttons).
- Use `rounded-lg` (8px) for larger buttons or small cards.
- Use `rounded-xl` (12px) for project or request cards, and modals.
- Never mix different border radii in the same component structure (e.g., a card with 12px radius should have inner images with matching inner radii, usually `radius - padding`).

## 2. No Random Paddings
- Only use values defined in the Spacing System (4, 8, 12, 16, 20, 24, 32, 40, 48, 64). 
- Replace random Tailwind padding values (`p-3`, `p-5`) with standard spacing (`p-4` = 16px, `p-6` = 24px, `p-8` = 32px, `p-3` = 12px).

## 3. No Mixed Button Styles
- Stick to the defined Primary, Secondary, and Ghost button varieties.
- Avoid inline styled buttons or unique color combinations that break the semantic token system.

## 4. No Inline Styling Chaos
- Do not use `style={{ ... }}` unless it's strictly necessary for dynamic values (e.g., dynamic width for a progress bar or canvas positioning).
- Define everything through Tailwind utility classes mapping to defined CSS variables.

## 5. No Unstyled Browser Defaults
- Never leave standard `<input type="text">` or `<select>` without TwinStack styling.
- Remove default outlines using `focus:outline-none focus:ring-2 focus:ring-accent-primary`.

## 6. No Low-Quality Placeholder Components
- Use precise Lucide icons.
- Never use randomly colored blocks for avatars or placeholders; use geometric initial avatars or clean SVG illustrations.

## 7. No "AI-Generated" Slop
- Eliminate default purple/blue gradients or heavy, dated drop shadows.
- Avoid large glowing text.
- Rely on layout, structure, contrast, and typography to build the interface.
- Keep animation functional, avoid random bouncy elements.
