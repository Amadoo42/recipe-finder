# Seed Data Utility Documentation

## Overview

The seed utility in this project lives in `js/utils/seed-data.js` and exports the function `seedDatabase`.

Its job is to reset browser `localStorage` with a predefined dummy dataset so you can quickly test flows like:

- user login
- admin login
- recipe browsing
- favorites
- session restore behavior

This utility is intentionally destructive by design (for local development only).

## What `seedDatabase` does

When called, `seedDatabase`:

1. Shows a confirmation dialog warning that existing local data will be replaced.
2. If confirmed:
   - clears `localStorage`
   - dynamically generates matching password hashes for all dummy users
   - serializes the `users` and `recipes` JavaScript arrays into the stringified JSON format expected by the DB
   - writes each non-null key into `localStorage`
3. Logs success in the browser console.
4. Asks whether to reload the page.
5. If accepted, reloads so UI reflects new data.
6. If an error occurs during the process, it logs the error to the console.

### Side effects

- `localStorage.clear()` deletes all existing keys for this origin.
- Any current app state in storage is removed.
- Existing session data is replaced with the seeded `session` value (or omitted if null).

## Global access behavior

At the end of the file, the function is attached to `window`:

```js
window.seedDatabase = seedDatabase;
```

This allows you to run it directly from browser DevTools in development.

## Built-in UI trigger in index page

The home page already includes a testing button that runs the seeder:

- File: `index.html`
- Button text: `Load dummy data`
- Button id: `seedData`
- Click handler: `onclick="seedDatabase()"`

This works because `index.html` also loads `js/utils/seed-data.js`, which exposes `seedDatabase` on `window`.

## How to use it

### Option 1: Run from browser console (quickest)

1. Open the app in your browser.
2. Open DevTools console.
3. Run:

```js
window.seedDatabase();
```

4. Confirm the warning prompts.
5. Reload when prompted.

### Option 2: Import and call from code

Use this for custom developer actions, temporary debug buttons, or scripted setup during development.

```js
import seedDatabase from "./utils/seed-data.js";

seedDatabase();
```

Use with care because it clears storage.

## Storage shape expected by this seeder

Unlike the raw database which expects double-stringified JSON, this seeder relies on standard JavaScript arrays for ease of editing. The script handles the serialization automatically.

Current pattern in file:

```javascript
const users = [ { ... }, { ... } ];
const recipes = [ { ... }, { ... } ];
```

## How to customize the data

### 1. Edit users

Inside the file, update the standard JavaScript array assigned to `users`.

User object fields currently used:

- `firstName`
- `lastName`
- `username`
- `email`
- `passwordHash` (Can be left as placeholder text; it is auto-hashed upon seeding)
- `role` (`user` or `admin`)
- `savedRecipes` (array of recipe IDs or objects depending on your app logic)
- `token` (usually `null` in seed)

If you add or remove user fields, make sure auth/profile rendering code can handle it.

### 2. Edit recipes

Inside the file, update the standard JavaScript array assigned to `recipes`.

Recipe object fields currently used:

- `id` (must be unique)
- `name`
- `description`
- `courseType`
- `ingredients` (array of `{ name, quantity, unit }`)
- `image` (URL)

Tips:

- Keep `id` unique and stable.
- Keep ingredient structure consistent.
- Use valid image URLs to avoid broken cards.

### 3. Edit session

Set `session` in the `dataToStore` object to:

- `null` to start fully logged out
- a plain token string (for example, `"demo-token"`) to simulate a restored logged-in session

To pre-seed an authenticated session correctly, the matching user record in `users` must also have the same token value in its `token` field. For example, if `session` is set to `"demo-token"`, the user you expect to be logged in must include `token: "demo-token"`.

If `session` is set but no user has the same `token`, session restore will not behave as an authenticated login. If unsure, keep `session: null` and log in normally after seeding.

## Password and authentication notes

Seeded users' passwords are automatically hashed to **`password123`** via the app's native `hash()` utility during the seeding process. You do not need to manually hash passwords in this file. 

If login fails for newly added users, most likely causes are:

- role or required auth fields are missing
- user object structure has typos

Use existing working user entries as a template when adding new accounts.

## Typical development scenarios

### Reset to known clean state

Use seeder before testing a bug to eliminate stale local data effects.

### Prepare admin testing

Seed an admin user (`role: "admin"`) and verify admin dashboard features quickly.

### Test favorites and session behavior

Pre-fill `savedRecipes` and optionally session data to simulate specific user state.

## Troubleshooting

### "Failed to seed database"

Cause:
- Syntax error in the JavaScript arrays (missing commas, unclosed brackets).

Fix:
- Check your IDE for syntax highlighting errors.
- Ensure all newly added recipe and user objects are properly formatted JavaScript objects.

### Seeding succeeds but UI looks empty

Cause:
- schema mismatch between seeded objects and UI expectations
- empty arrays in `users` or `recipes`

Fix:
- verify required fields for recipe cards and user display
- inspect `localStorage` values in DevTools Application tab

### Login does not work with seeded user

Cause:
- role or required auth fields missing

Fix:
- Remember that all seeded accounts default to the password **`password123`**.
- copy a known working user and edit carefully.

## Security and environment warning

This utility is meant for local development/testing only.

Do not use it in production-like environments. It wipes stored client state and includes hardcoded test credentials/data.

## Quick reference

- Function: `seedDatabase`
- File: `js/utils/seed-data.js`
- Global call: `window.seedDatabase()`
- Risk level: destructive to local storage
- Primary use: reset and preload predictable local test data
