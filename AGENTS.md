# Repository Guidelines

## Project Structure & Module Organization

The repository contains an Express/MySQL backend and a React/Vite frontend.

- `server.js`, `config.js`, and `db.js` initialize the application, runtime configuration, and database pool.
- `api/` contains route handlers; `middleware/` contains request guards; `services/` owns upload and ZIP archive workflows; `utils/` contains shared backend helpers.
- `client/src/` contains the React application. Put route-level screens in `pages/`, reusable UI in `components/`, hooks in `hooks/`, translations in `locales/`, and shared helpers in `utils/`.
- Component and page styles live under their corresponding `styles/` directories. Static public files belong in `client/public/`; imported media belongs in `client/src/assets/`.
- `projects/` stores uploaded project content and is intentionally ignored by Git. Vite generates production assets in `client/build/`.

## Build, Test, and Development Commands

Install dependencies separately at the repository root and in `client/`.

- `npm run dev`: run the Express server with Nodemon on port 3000 by default.
- `npm run start`: run the backend without file watching.
- `cd client && npm run dev`: start Vite on port 5173 with API requests proxied to Express.
- `cd client && npm run lint`: check JavaScript, JSX, React Hooks, and refresh rules.
- `cd client && npm run build`: create the production frontend in `client/build/`.
- `npm run generate:og`: regenerate the Open Graph preview asset.

Copy `.env.example` to `.env` before local backend work and provide MySQL, session, panel, and site values. Never commit `.env` or credentials.

## Coding Style & Naming Conventions

Use two-space indentation, double quotes, semicolons, and trailing commas where the surrounding code does. Backend files use CommonJS (`require`); frontend files use ES modules. Name React components and their files in `PascalCase` (`ProjectHero.jsx`), hooks with `use` (`usePanelAuth.js`), and helpers in `camelCase`. Keep route handlers thin by moving archive, upload, and other reusable workflows into `services/`.

## Testing Guidelines

There is currently no automated test suite or coverage threshold; the root `npm test` script intentionally fails. For every change, run client lint and build, use `node --check <file>` for edited backend files, and manually exercise affected API routes with a configured MySQL database. Include regression cases for authentication, uploads, ZIP validation, and rollback behavior when those areas change.

## Commit & Pull Request Guidelines

Recent history primarily follows Conventional Commits: `feat:`, `fix:`, `refactor:`, and `build(deps):`. Keep subjects imperative and scoped to one logical change. Pull requests should explain behavior changes, list validation commands, link relevant issues, and include screenshots for visible UI changes. Call out database, environment, security, or deployment impacts explicitly.
