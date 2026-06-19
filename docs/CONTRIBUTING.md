# Contributing to E-Summit '26 Backend

First off, thank you for considering contributing to the E-Summit '26 backend server! This project powers checkout ticketing and gating controls for IIT Roorkee's flagship entrepreneurship event. Adhering to the following guidelines ensures a smooth collaboration environment.

## Code of Conduct
Please be polite, collaborative, and professional in all interactions.

## Branch Conventions
We utilize a modular development approach:
- Main Branch: `main` (production stable)
- Development Branch: `dev` (integration branch)
- Feature branches should target `dev` and follow: `feat/feature-name` or `fix/bug-name`.

## Folder Organization
The codebase follows a strictly modular layout under `src/modules/`.
Each feature folder includes:
- `*.routes.js` - Routing endpoints
- `*.controller.js` - HTTP Request/Response parsers
- `*.service.js` - Core logical functions
- `*.model.js` - Mongoose entity schema definitions
- `*.validation.js` - Payload validators (Zod schemas)
- `README.md` - Sub-module context

Shared infrastructure elements belong in `src/common/`.

## Setup Instructions
1. Clone the repository.
2. Run `npm install` to setup node dependencies.
3. Duplicate `.env.example` to `.env` and fill out your local variables (MongoDB URI, SMTP, etc.).
4. Run `npm run dev` to launch development nodemon server.

## Code Standards
- **Lints & Style**: We use ESLint and Prettier. Check your code style prior to committing:
  ```bash
  npx eslint .
  ```
- **Tests**: Write unit/integration tests for your endpoints under the `tests/` directory. Run tests with:
  ```bash
  npm run test
  ```
- **Error Handling**: Do not write bare `try-catch` blocks inside Express routes. Wrap controller handlers with the `asyncHandler` helper.

## Pull Request Guidelines
1. Ensure all tests pass and ESLint checks are green.
2. Link your Pull Request to the corresponding GitHub issue.
3. Provide a clear description of the modifications, adding details about changes, new environment keys, or updated schemas.
