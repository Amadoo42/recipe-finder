# Coding & Naming Conventions

All contributors must adhere to the following conventions to pass code reviews.

## Git Workflow
* **Main Branch:** `main` (Production-ready, stable code only).
* **(Planned) Development Branch:** `dev` (Future integration branch for testing features together).
  * **Note: The `dev` branch does not currently exist; until it does, follow the `main`-based workflow below.**
* **Feature Branches:** Create branches off `main` using the format `category/snake_case` (once `dev` exists, feature branches will be created from `dev` instead).
* *Categories:* `feature`, `bugfix`, `hotfix`, `refactor`, `docs`.
* *Example:* `feature/search_filter`

## Issue & Commit Prefixes
To keep our history and issue tracker clean and readable, all commit messages and issue titles must start with one of the following prefixes:
* **`feat:`** A new feature or functionality.
* **`fix:`** A bug fix.
* **`styl:`** Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, UI styling tweaks, etc.).
* **`idea:`** Proposals for new features, architecture changes, or general discussions (primarily used for issues).
* **`refactor:`** A code change that neither fixes a bug nor adds a feature.
* **`docs:`** Documentation only changes (e.g., updating README or markdown files).
* **`test:`** Adding missing tests or correcting existing tests.
* **`chore:`** Changes to the build process or auxiliary tools and libraries.

**Commit Message Examples:**
* `feat: add search filter logic to recipe dashboard`
* `fix: resolve crash on login page`
* `styl: update primary button color to match branding`

## Issue Formatting Standard
When creating a new issue, use the following structure to ensure clarity for all team members:

### 1. Title
Format: `<prefix>: Brief description of the task`, where `<prefix>` is one of: `feat`, `fix`, `styl`, `idea`, `refactor`, `docs`, `test`, `chore` (e.g., `feat: Add tooltips to all icons`).

### 2. Description
Provide a high-level summary of why this change is necessary and what it aims to achieve.

### 3. Proposed Changes
List specific UI elements or logic modules that will be affected. Use bullet points for readability:
* **UI Components**: Mention specific buttons, nav bars, or pages.
* **Styling**: Note if new CSS classes or global styles are required.

### 4. Technical Details
Identify the specific files or utility functions that need modification (e.g., `main.css`, `auth.js`).

### 5. Acceptance Criteria
Include a checklist of requirements that must be met for the issue to be considered "Done":
* [ ] Requirement 1
* [ ] Requirement 2

## Naming Standards
| Target | Convention | Example |
| :--- | :--- | :--- |
| **Files** | kebab-case | `login-handler.js`, `main.css` |
| **JS Variables/Functions/CSS IDs** | camelCase | `fetchRecipes()`, `recipeList`, `checkAuth()` |
| **JS Constants** | SCREAMING_SNAKE | `MAX_LOGIN_ATTEMPTS`, `PUBLIC_PAGES` |
| **CSS/JS Classes** | PascalCase | `RecipeCard`, `SubmitButton`, `GreatVibes` |

## Imports & Path Conventions
The codebase is served via a Django backend. As such, using relative import paths like `../../utils/whatever.js` is strictly forbidden. It creates brittle code, deep nesting unreadability, and breaks immediately if files are moved.

All imports must use **Absolute Root-Relative Paths** starting with Django's `/static/` prefix.

**Never do this:**
```js
import { createMessage } from "../../shared/utils/create-message.js";
import { getRecipes } from "./db-recipes.js";
```
**Always do this:**
```js
import { createMessage } from "/static/shared/utils/create-message.js";
import { getRecipes } from "/static/shared/database/db-recipes.js";
```

## JavaScript Best Practices
1. **ES6 Syntax:** Use `const` by default. Use `let` only if reassignment is strictly necessary. Never use `var`.
2. **Error Handling:** Implement `try...catch` blocks around JSON parsing and database access logic.
