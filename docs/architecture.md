# System Architecture

The Recipe Finder application is a web application built with HTML, CSS, and Vanilla JavaScript served by a django python server. It is a full-stack environment by utilizing django's model API as a persistent, synchronous database.

## Directory Structure

The project is organized into modular directories to separate frontend, backend and database operations:

```text
recipe-finder/
├── backend/            # Main backend folder
|   |
│   ├── backend/        # Backend specific logic
│   │   
│   └── core/           # Core app: serves index/login/signup pages
│       
│          
├── docs/               # Project documentation and schemas
└── frontend/
    ├── api/            # Client-side API (e.g. `auth.js`) 
    ├── components/     # Custom components used in different pages
    ├── constants/      # Constants files (e.g. `auth-constants.js`)
    ├── pages/          # All HTML pages organized by level
    │   ├── admin/
    │   │   ├── css/
    │   │   └── js/
    │   ├── core/
    │   │   ├── css/
    │   │   └── js/
    │   └── user/
    │       ├── css/
    │       └── js/
    └── shared/         # Common files used by multiple page in different levels 
        ├── assets/
        ├── css/
        ├── database/
        ├── js/
        └── utils/
```

## Layered Design Pattern (legacy)

To prevent tight coupling between the UI and the data layer, the application enforces a strict unidirectional flow:

1. **UI Handlers (`js/handlers/`)**: Attach event listeners to the DOM. They extract user input, invoke validators and schema factories from `js/utils/`, and pass standardized objects to the Database Layer. They never access `localStorage` directly.
2. **Database API (`js/database/`)**: Exposes abstracted CRUD functions (e.g., `addRecipe()`, `verifyLogin()`). Assumes it receives pre-validated, normalized objects, applies business rules, and reads/writes to `localStorage` via `db-core.js`.
3. **Utilities (`js/utils/`)**: Provides isolated, reusable logic such as schema factories, input validators, password hashing, and response message wrappers (`create-message.js`).