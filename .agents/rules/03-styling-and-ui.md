---
description: Enforces the design system, Tailwind CSS styling constraints, and UI component usage.
trigger: always_on
---

# Styling and UI Guidelines

The project relies on a specific design system. Adhere strictly to these rules:

1. **Utility-First Styling**: 
   - Use **Tailwind CSS v3** utility classes for ALL styling. 
   - Do NOT create `.css` or `.scss` files for component-specific styles unless it is completely unavoidable.
2. **Component Library**: 
   - Use **shadcn/ui** (based on Radix UI primitives) for interactive components. 
   - If a standard component (like a Modal, Select, or Dropdown) is needed, assume a shadcn/ui implementation exists and should be used over writing a custom accessible component from scratch.
3. **Icons**: 
   - Use **Lucide React** (`lucide-react`) exclusively for icons. Do not import FontAwesome or Heroicons.
4. **Data Visualization & Interactivity**: 
   - Use **Recharts** for any charts, graphs, or data visualizations.
   - Use **dnd-kit** for complex drag-and-drop interactions (like Kanban boards).
5. **Responsiveness & Theming**: 
   - Ensure all layouts are mobile-first and fully responsive using Tailwind's `sm:`, `md:`, `lg:` prefixes.
   - Support Dark Mode via Tailwind's `dark:` variant and CSS variables. Do not hardcode specific colors that break in dark mode.
