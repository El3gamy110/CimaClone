---
description: Enforces the core frontend technology stack, including React, Vite, React Router, and TanStack Query.
trigger: always_on
---

# Frontend Tech Stack Guidelines

When generating, scaffolding, or modifying code in this project, you MUST adhere to the following frontend stack:

1. **Framework & Language**: 
   - Use **React 18** functional components.
   - Use **TypeScript** with strict typing. Do not use `any` unless absolutely necessary.
2. **Build Tool**: 
   - The project is built with **Vite 5**. Avoid tools or configurations that are specific to Webpack or Create React App.
3. **Routing**: 
   - Use **React Router DOM v6** for all client-side routing. Use standard `<Link>` and `useNavigate` hooks.
4. **Data Fetching & State**: 
   - Use **TanStack Query v5** (`@tanstack/react-query`) for all asynchronous server state, fetching, caching, and mutations.
5. **Forms & Validation**: 
   - Use **React Hook Form** for all form handling to maximize performance.
   - Use **Zod** for schema-based validation.
6. **Mobile (Optional but supported)**: 
   - Keep in mind the project uses **Capacitor** for cross-platform native builds. Avoid relying heavily on browser APIs that might not work cleanly in a Capacitor mobile wrapper without proper fallbacks.
