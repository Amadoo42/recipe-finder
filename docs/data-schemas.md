# Database Models & JSON Schemas

Data is stored in `localStorage` as serialized JSON strings. The system relies on predefined keys: `users`, `recipes`, and `session`.

## Standard Response Object (MessageObject)
Many write/validation functions in `js/database/` return a `MessageObject`, especially operations that can succeed or fail and need a status for UI feedback.

Read/query helpers may return raw values instead of `MessageObject`.
Examples from `db-recipes.js`:
- `getRecipes()` returns `RecipeObject[]`
- `getRecipeById(recipeId)` returns `RecipeObject | null`
- `searchRecipes(queryText, courseFilter)` returns `RecipeObject[]`

When adding new DB functions, match the return style used by the module/API contract (see `docs/database-api.md`).

The object shape is:
- `success`: boolean (`true` if operation succeeded, otherwise `false`)
- `description`: string (technical or user-facing message)
- `data`: payload value or `null`

Example JSON:
```json
{
  "success": true,
  "description": "Recipe created successfully",
  "data": null
}
```
## 1. User Schema (`users`)
Stored as an array of `UserObject` dictionaries under the `users` key.
```json
{
  "firstName": "string",
  "lastName": "string",
  "username": "string (Unique)",
  "email": "string (Unique)",
  "passwordHash": "string (Hashed representation)",
  "role": "string ('admin' | 'user')",
  "savedRecipes": ["array of recipe IDs (strings)"],
  "token": "string or null"
}
```
## 2. Session Schema (`session`)
Stores the authentication token of the current user. Overwritten upon login and cleared on logout.

"string (Secure 32-character hex)"

## 3. Recipe Schema (`recipes`)
Stored as an array of `RecipeObject` dictionaries under the `recipes` key.
```json
{
  "id": "integer (Auto-incremented)",
  "name": "string",
  "description": "string",
  "courseType": "string ('Appetizers' | 'Main' | 'Dessert')",
  "ingredients": [
    {
      "name": "string",
      "quantity": "number",
      "unit": "string"
    }
  ],
  "image": "string (Base64 string or URL path)"
}
```