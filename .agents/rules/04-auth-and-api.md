---
description: Enforces authentication flows, API standards, and protected routing.
trigger: always_on
---

# Authentication & API Guidelines

When working on features involving data fetching or user authentication:

1. **Centralized API Client**: 
   - All network requests MUST go through the central configured API fetcher (typically located at `src/lib/api.ts`). This ensures base URLs and interceptors are consistently applied.
2. **Token Management**: 
   - The application uses JWT for authentication.
   - The `AuthContext` manages saving/retrieving the token to/from `sessionStorage`. Do not directly manipulate tokens in individual components.
   - The API fetcher must automatically attach the `Authorization: Bearer <token>` header to all outbound requests.
3. **Protected Routes**: 
   - Rely on React Router DOM along with the `AuthContext` to protect routes. 
   - Verify the user's role (extracted from the session/token) to prevent unauthorized access (e.g., keeping seekers out of the admin dashboard).
4. **Data Mutations**: 
   - Use TanStack Query's `useMutation` for POST/PUT/DELETE operations. 
   - Always invalidate relevant query caches (`queryClient.invalidateQueries`) after a successful mutation to keep UI data fresh.
