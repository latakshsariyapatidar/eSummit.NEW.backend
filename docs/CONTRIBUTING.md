# Contributing to E-Summit '26 Backend

Thank you for your interest in contributing to the E-Summit '26 backend! This project powers the digital infrastructure for IIT Dharwad's flagship entrepreneurship festival. Your contributions help make the event a success.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Branch Conventions](#branch-conventions)
- [Module Architecture](#module-architecture)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Common Patterns](#common-patterns)

---

## Code of Conduct

- Be respectful, polite, and collaborative in all interactions.
- Focus on constructive feedback during code reviews.
- Report issues through GitHub rather than personal channels.

---

## Getting Started

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/esummit26-backend.git
   cd esummit26-backend
   ```
3. **Install** dependencies:
   ```bash
   npm install
   ```
4. **Configure** your environment:
   ```bash
   cp .env.example .env
   # Fill in MONGODB_URI, ADMIN_KEY, etc.
   ```
5. **Seed** the database:
   ```bash
   npm run seed
   ```
6. **Start** the dev server:
   ```bash
   npm run dev
   ```

---

## Branch Conventions

| Branch | Purpose |
|---|---|
| `main` | Production-stable releases |
| `dev` | Integration branch — all PRs target here |
| `feat/feature-name` | New feature development |
| `fix/bug-name` | Bug fixes |
| `docs/change-name` | Documentation updates |
| `refactor/scope` | Code restructuring |
| `test/scope` | Test additions or fixes |

**Always branch from `dev`**, never from `main`:
```bash
git checkout dev
git pull origin dev
git checkout -b feat/your-feature
```

---

## Module Architecture

The codebase follows a **modular monolith** pattern. Each domain feature is self-contained under `src/modules/`:

```
src/modules/your-feature/
├── your-feature.routes.js       # Express router with endpoint definitions
├── your-feature.controller.js   # HTTP request/response handling
├── your-feature.service.js      # Core business logic
├── your-feature.model.js        # Mongoose schema definitions
├── your-feature.validation.js   # Zod input validation schemas (optional)
└── README.md                    # Module documentation
```

**Shared infrastructure** (config, middleware, utilities) lives in `src/common/`.

### Key Rules

- **Never** put business logic in route files or controllers.
- **Controllers** only parse requests and call services.
- **Services** contain all business logic and database operations.
- **Models** define schemas — no logic beyond virtuals, hooks, and statics.
- **New environment variables** must be added to both `.env.example` and `src/common/config/env.js`.

---

## Coding Standards

### Style

- **Linter**: ESLint (flat config) — run before every commit:
  ```bash
  npx eslint .
  ```
- **Formatter**: Prettier
- **Quotes**: Single quotes (`'`)
- **Semicolons**: Always
- **Indentation**: 2 spaces
- **Strict equality**: Always use `===`
- **Curly braces**: Required on all blocks (even single-line)

### Error Handling

- **Never** use bare `try-catch` blocks in Express routes.
- **Always** wrap controller handlers with the `asyncHandler` utility:
  ```js
  const asyncHandler = require('../../common/utils/asyncHandler');

  exports.myHandler = asyncHandler(async (req, res) => {
    // your code — errors auto-propagate to errorHandler
  });
  ```
- Throw errors with `statusCode` for the global error handler to format:
  ```js
  const err = new Error('Resource not found');
  err.statusCode = 404;
  throw err;
  ```

### API Responses

Use the standardised response utilities from `src/common/utils/apiResponse.js`:
```js
const { sendSuccess, sendError } = require('../../common/utils/apiResponse');

// Success
sendSuccess(res, data, 'Operation completed', 200);

// Error
sendError(res, 'Something went wrong', 400);
```

---

## Commit Guidelines

Follow [Conventional Commits](https://www.conventionalcommits.org/) for clear history:

```
<type>(<scope>): <short description>

[optional body]
```

**Types:**

| Type | Description |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style (no logic change) |
| `refactor` | Code restructuring |
| `test` | Adding/fixing tests |
| `chore` | Build, CI, or tooling changes |

**Examples:**
```
feat(orders): add duplicate UTR detection on submit
fix(checkin): handle expired pass gracefully
docs(api): add rate limit info to API.md
```

---

## Pull Request Process

1. **Ensure** your branch is up-to-date with `dev`:
   ```bash
   git fetch origin
   git rebase origin/dev
   ```
2. **Run** all checks locally:
   ```bash
   npx eslint .
   npm test
   ```
3. **Submit** your PR against the `dev` branch.
4. **Fill out** the PR template with:
   - What the change does and why
   - Any new environment variables introduced
   - Any schema/model changes
   - Screenshots (for admin dashboard or API changes)
5. **Link** the PR to the relevant GitHub issue (if applicable).
6. **Address** review feedback promptly.

### PR Checklist

- [ ] Code follows the module pattern (routes → controller → service → model)
- [ ] ESLint passes with no errors
- [ ] Tests written for new/changed endpoints
- [ ] All tests pass
- [ ] New env vars added to `.env.example` and `env.js`
- [ ] Module README updated (if applicable)
- [ ] No hardcoded secrets or credentials

---

## Common Patterns

### Adding a New Module

1. Create the directory: `src/modules/your-module/`
2. Create the standard files: `routes`, `controller`, `service`, `model`, `README.md`
3. Mount the router in `src/app.js`:
   ```js
   const yourRouter = require('./modules/your-module/your-module.routes');
   app.use('/api/your-module', yourRouter);
   ```
4. Add tests in `tests/your-module.test.js`

### Adding a New Content Type

1. Add the Mongoose schema to `src/modules/content/content.model.js`
2. Add the service method in `content.service.js`
3. Add the controller handler in `content.controller.js`
4. Add the route in `content.routes.js`
5. Add seed data to `scripts/seed.js`

---

*Questions? Open a GitHub issue or start a discussion — we're here to help!*
