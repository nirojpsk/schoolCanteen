# Frontend Production Checklist

## Before Deploy
- Confirm `VITE_API_BASE_URL` or Vite proxy target points to the real backend.
- Confirm backend `CLIENT_URL`, cookie settings, and CORS match the deployed frontend origin.
- Verify JWT cookie works over HTTPS in the target environment.
- Run `npm run verify`.

## Critical Manual QA
- Student registration, login, logout, and protected account routing.
- Admin login, admin logout, and dashboard access restrictions.
- Public menu loading, category filtering, and specials rendering.
- Preorder creation with valid and invalid input.
- Profile update and password change flows.
- Unknown routes and 404 handling.

## Browser and Device QA
- Chrome, Edge, Firefox, Safari.
- Mobile layout checks for navbar, auth pages, preorder form, and admin tables.
- Slow-network behavior for loading and error states.

## Operational Readiness
- Add frontend error monitoring in production.
- Add backend/API monitoring and structured logs.
- Add end-to-end tests for auth, preorder, and admin CRUD flows.
- Review accessibility with keyboard-only and screen-reader testing.
