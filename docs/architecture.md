# System Architecture

The Recipe Finder application is a frontend-only web application built with HTML, CSS, and Vanilla JavaScript. It simulates a full-stack environment by utilizing the browser's `localStorage` API as a persistent, synchronous database.

## Directory Structure

The project is organized into modular directories to separate UI, logic, and database operations:

```text
recipe-finder/
├── admin/                  # Admin-specific pages (dashboard, add-recipe, view-recipe)
├── assets/                 # Static images and icons
├── css/                    # Global and page-specific stylesheets
├── docs/                   # Project documentation and schemas
├── js/                     # Application logic
│   ├── constants/          # System-wide configuration constants
│   ├── database/           # Simulated DB operations via localStorage
│   ├── handlers/           # DOM manipulation and event listeners
│   └── utils/              # Pure functions, helpers, and validators
├── user/                   # User-specific pages (dashboard, search, favorites)
└── index.html              # Entry point
```

## Layered Design Pattern

To prevent tight coupling between the UI and the data layer, the application enforces a strict unidirectional flow:

1. **UI Handlers (`js/handlers/`)**: Attach event listeners to the DOM. They extract user input, invoke validators and schema factories from `js/utils/`, and pass standardized objects to the Database Layer. They never access `localStorage` directly.
2. **Database API (`js/database/`)**: Exposes abstracted CRUD functions (e.g., `addRecipe()`, `verifyLogin()`). Assumes it receives pre-validated, normalized objects, applies business rules, and reads/writes to `localStorage` via `db-core.js`.
3. **Utilities (`js/utils/`)**: Provides isolated, reusable logic such as schema factories, input validators, password hashing, and response message wrappers (`create-message.js`).