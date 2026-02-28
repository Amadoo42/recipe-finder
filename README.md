# Recipe Finder — Phase 1

A web application that connects food lovers and home cooks, allowing them to browse, search, and manage recipes. Built as part of the IS231 Web Technology course at the Faculty of Computers and Artificial Intelligence, Cairo University.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Pages](#pages)
- [File Structure](#file-structure)
- [Team](#team)
- [Acknowledgments](#acknowledgments)

---

## About the Project

Recipe Finder is a multi-user web application with two roles: **Admins** and **Users**.

- **Admins** can add, edit, and delete recipes from the platform.
- **Users** can browse, search, and save their favorite recipes.

**Phase 1** covers all HTML pages with no CSS or JavaScript — pure semantic HTML only. Styling and interactivity will be introduced in later phases.

---

## Pages

The project is split across 8 HTML pages:

| Page | Path | Description |
|---|---|---|
| Home | `index.html` | Entry point — welcome message with links to sign up and log in |
| Sign Up | `signup.html` | Registration form for both admins and users |
| Login | `login.html` | Authentication page |
| Admin Dashboard | `admin/dashboard.html` | Lists all recipes with edit and delete actions |
| Add Recipe | `admin/add-recipe.html` | Form to create a new recipe with multiple ingredients |
| Edit Recipe | `admin/edit-recipe.html` | Pre-filled form to modify an existing recipe |
| Search & Browse | `user/search.html` | Search bar and results filtered by dish name or ingredient |
| Recipe Details | `user/recipe-details.html` | Full instructions and ingredient list for a single recipe |
| Favorites | `user/favorites.html` | List of recipes saved by the logged-in user |

---

## File Structure

```
recipe-finder/
│
├── index.html
├── signup.html
├── login.html
│
├── admin/
│   ├── dashboard.html
│   ├── add-recipe.html
│   └── edit-recipe.html
│
├── user/
│   ├── search.html
│   ├── recipe-details.html
│   └── favorites.html
│
├── assets/
│   └── logo.svg
│
├── css/                  # Phase 2
│   └── main.css
│
└── js/                   # Phase 3
    └── validation.js
```

---

## Team

| Name | ID | Section | Role |
|---|---|---|---|
| Ahmad Amin Mahmoud El-Metwally | 20240750 | S15 | Leader — Navigation bar & Landing page |
| Seif Mohamed Lashin | 20240270 | S15 | Data Display — Admin Dashboard & Recipe Catalog |
| Jana Ali Hassan Amin | 20240140 | S16 | Content Display — Recipe Details & Favorites page |
| Yara Ramy Hegab | 20240655 | S15 | User Flow — User Dashboard, Search & Catalog |
| Muhammed Ahmed Esmail | 20240460 | S14 | Auth Specialist — Sign Up & Login pages |
| Youssef Essam Abdelkader | 20240698 | S15 | Form Specialist — Add New Recipe page |

**TA:** Eng. Mira Raheem

---

## 🎓 Acknowledgments

- This project is submitted as part of the **IS231 Web Technology course** course.
- **Faculty of Computers and Artificial Intelligence (FCAI), Cairo University.**
