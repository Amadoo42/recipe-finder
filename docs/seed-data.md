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

1. Parses a hardcoded JSON string (`dummyData`) into an object.
2. Shows a confirmation dialog warning that existing local data will be replaced.
3. If confirmed:
   - clears `localStorage`
   - writes each non-null key from parsed data into `localStorage`
4. Logs success in the browser console.
5. Asks whether to reload the page.
6. If accepted, reloads so UI reflects new data.
7. If parsing fails, logs an error.

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

## Option 1: Run from browser console (quickest)

1. Open the app in your browser.
2. Open DevTools console.
3. Run:

```js
window.seedDatabase();
```

4. Confirm the warning prompts.
5. Reload when prompted.

## Option 2: Import and call from code

Use this for custom developer actions, temporary debug buttons, or scripted setup during development.

```js
import seedDatabase from "./utils/seed-data.js";

seedDatabase();
```

Use with care because it clears storage.

## Storage shape expected by this seeder

`dummyData` is a JSON string that parses into an object with keys like:

- `users`
- `recipes`
- `session`

Important detail: in the current implementation, `users` and `recipes` are themselves JSON-encoded strings (not direct arrays). That means after `JSON.parse(dummyData)`, those fields are still strings that your DB layer parses later.

Current pattern in file:

```json
{
  "users": "[{...}, {...}]",
  "recipes": "[{...}, {...}]",
  "session": null
}
```

## How to customize the data

### 1. Edit users

Inside `dummyData`, update the JSON string assigned to `users`.

User object fields currently used:

- `firstName`
- `lastName`
- `username`
- `email`
- `passwordHash`
- `role` (`user` or `admin`)
- `savedRecipes` (array of recipe IDs or objects depending on your app logic)
- `token` (usually `null` in seed)

If you add or remove user fields, make sure auth/profile rendering code can handle it.

### 2. Edit recipes

Inside `dummyData`, update the JSON string assigned to `recipes`.

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

Set `session` in parsed object to:

- `null` to start fully logged out
- a plain token string (for example, `"demo-token"`) to simulate a restored logged-in session
To pre-seed an authenticated session correctly, the matching user record in `users` must also have the same token value in its `token` field. For example, if `session` is set to `"demo-token"`, the user you expect to be logged in must include `token: "demo-token"`.
If `session` is set but no user has the same `token`, session restore will not behave as an authenticated login. If unsure, keep `session: null` and log in normally after seeding.

If unsure, keep `session: null` and log in normally after seeding.

## Safer editing workflow

Because this file uses nested JSON strings, manual editing is easy to break. Recommended workflow:

1. Prepare your `users` and `recipes` as normal JavaScript arrays first.
2. Convert them to JSON strings with `JSON.stringify`.
3. Paste resulting strings into `dummyData`.
4. Run seeder and verify app loads without parse errors.

Example helper approach:

```js
const users = [
  {
    firstName: "Test",
    lastName: "User",
    username: "testuser",
    email: "test@example.com",
    passwordHash: "...",
    role: "user",
    savedRecipes: [],
    token: null
  }
];

const recipes = [
  {
    id: 1,
    name: "Example Recipe",
    description: "Example",
    courseType: "Main",
    ingredients: [{ name: "Salt", quantity: 1, unit: "tsp" }],
    image: "https://example.com/image.jpg"
  }
];

const dummyData = JSON.stringify({
  users: JSON.stringify(users),
  recipes: JSON.stringify(recipes),
  session: null
});
```

## Password and authentication notes

Seeded users must contain password hashes that match your auth checker.

If login fails for newly added users, most likely causes are:

- hash format does not match the app's hash utility
- password hash was copied incorrectly
- auth validator expects additional fields

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

- `dummyData` is invalid JSON
- nested `users`/`recipes` JSON string is malformed

Fix:

- validate JSON
- check quotes and escaping
- rebuild strings using `JSON.stringify`

### Seeding succeeds but UI looks empty

Cause:

- schema mismatch between seeded objects and UI expectations
- empty arrays in `users` or `recipes`

Fix:

- verify required fields for recipe cards and user display
- inspect `localStorage` values in DevTools Application tab

### Login does not work with seeded user

Cause:

- wrong `passwordHash`
- role or required auth fields missing

Fix:

- copy a known working user and edit carefully
- regenerate hash using project hash utility workflow

## Security and environment warning

This utility is meant for local development/testing only.

Do not use it in production-like environments. It wipes stored client state and includes hardcoded test credentials/data.

## Quick reference

- Function: `seedDatabase`
- File: `js/utils/seed-data.js`
- Global call: `window.seedDatabase()`
- Risk level: destructive to local storage
- Primary use: reset and preload predictable local test data
