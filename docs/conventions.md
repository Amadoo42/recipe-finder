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

## Naming Standards
| Target | Convention | Example |
| :--- | :--- | :--- |
| **Files** | kebab-case | `login-handler.js`, `main.css` |
| **JS Variables/Functions/CSS IDs** | camelCase | `fetchRecipes()`, `recipeList`, `checkAuth()` |
| **JS Constants** | SCREAMING_SNAKE | `MAX_LOGIN_ATTEMPTS`, `PUBLIC_PAGES` |
| **CSS/JS Classes** | PascalCase | `RecipeCard`, `SubmitButton`, `GreatVibes` |

## JavaScript Best Practices
1. **ES6 Syntax:** Use `const` by default. Use `let` only if reassignment is strictly necessary. Never use `var`.
2. **Error Handling:** Implement `try...catch` blocks around JSON parsing and database access logic.