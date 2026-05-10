# Recipe Finder

A web application that connects food lovers and home cooks, allowing them to browse, search, and manage recipes. Built as part of the IS231 Web Technology course at the Faculty of Computers and Artificial Intelligence, Cairo University.

---

## Table of Contents
- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Setup](#setup)
- [Team](#team)
- [Acknowledgments](#acknowledgments)

---

## About the Project

Recipe Finder is a multi-user web application with two roles: **Admins** and **Users**.

- **Admins** can add, edit, and delete recipes from the platform.
- **Users** can browse, search, and save their favorite recipes.

Recipe Finder comes with a full **Django + Python** backend with server-side authentication, session management, and a REST-like API layer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python, Django |
| Frontend | HTML, CSS, JavaScript |
| Auth | Django session-based authentication |
| Database | Postgres (neon.tech) |

---

## File Structure
```
recipe-finder/
│
├── backend/                        # Django project root
│   ├── backend/                    # Project settings, URLs, middleware
│   ├── core/                       # Shared app — auth views, models, constants
│   │   └── services/               # Message, validation utilities
│   ├── admin_app/                  # Admin-facing views and logic
│   └── user_app/                   # User-facing views and logic
│
├── frontend/                       # Static files
│   ├── api/                        # API class for making requests
│   ├── constants/                  # Shared JS constants
│   ├── pages/
│   │   ├── core/                   # Login, signup pages
│   │   ├── admin/                  # Admin dashboard, recipe management
│   │   └── user/                   # Browse, search, favorites
│   └── shared/                     # Shared assets, CSS, JS utilities
│
└── docs/                           # Documentation
```
---

## Setup

```bash
# Clone the repo
git clone https://github.com/Amadoo42/recipe-finder.git
cd recipe-finder

# Create and activate virtual environment
python3 -m venv .venv

# Linux/WSL:
source .venv/bin/activate 
# Windows:
./.venv/Scripts/activate

# Install dependencies
pip install -r requirements.txt

# Create the .env and add your keys 
touch .env
# DATABASE_URL="xxx"

# Run migrations
cd backend
python manage.py makemigrations
python manage.py migrate

# Start the server
python manage.py runserver
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
