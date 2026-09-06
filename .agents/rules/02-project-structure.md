---
description: Enforces the directory structure and file placement for frontend applications.
trigger: always_on
---

# Frontend Project Structure Guidelines

Follow this directory structure precisely when creating new files or restructuring code:

- `src/components/ui/`: Contains generic, headless, or primitive UI components (e.g., standard buttons, dialogs). This is exclusively for shadcn/ui or fundamental building blocks.
- `src/components/<feature>/`: (e.g., `admin-dashboard/`, `seeker-dashboard/`) Contains complex, domain-specific components that compose UI primitives.
- `src/layouts/`: Contains page wrappers and layout structures (e.g., navigation bars, sidebars) used consistently across routes.
- `src/pages/`: Contains the actual route components. These should generally compose components from `src/components` and avoid excessive inline markup. Group pages by domain if necessary (e.g., `src/pages/admin/`).
- `src/lib/`: Contains utility functions (like `utils.ts` for Tailwind merge) and centralized API configurations (`api.ts`).
- `src/hooks/`: Contains all custom React hooks.
- `src/context/`: Contains global React Context providers (e.g., `AuthContext.tsx`).

Always place new code in the most appropriate folder to maintain high cohesion and separation of concerns.
