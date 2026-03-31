import { logout } from './auth.js';

export function buildNav() {
    const path = window.location.pathname;

    var pageType = 'Guest';

    if (path.includes('/user/')) pageType = 'User';
    if (path.includes('/admin/')) pageType = 'Admin';

    const adminLinks = `
        <div class="NavContainer">
            <a class="NavBrand" href="/admin/dashboard.html">Recipe Finder</a>
            <div class="NavLinks">
                <a href="/admin/add-recipe.html"><span class="material-symbols-rounded">add_circle</span>Add Recipe</a>
                <a href="/admin/view-recipe.html"><span class="material-symbols-rounded">visibility</span>View Recipes</a>
                <a href="../index.html" id="logout-btn"><span class="material-symbols-rounded">logout</span>Logout</a>
            </div>
        </div>
    `;

    const userLinks = `
        <div class="NavContainer">
            <a class="NavBrand" href="/user/dashboard.html">Recipe Finder</a>
            <div class="NavLinks">
                <a href="/user/search.html"><span class="material-symbols-rounded">search</span>Browse</a>
                <a href="/user/favourites.html"><span class="material-symbols-rounded">favorite</span>Favourites</a>
                <a href="../index.html" id="logout-btn"><span class="material-symbols-rounded">logout</span>Logout</a>
            </div>
        </div>
    `;

    const guestLinks = `
        <div class="NavContainer">
            <a class="NavBrand" href="/index.html">Recipe Finder</a>
            <div class="NavLinks">
                <a href="/index.html"><span class="material-symbols-rounded">home</span>Home</a>
                <a href="/login.html"><span class="material-symbols-rounded">login</span>Login</a>
                <a href="/signup.html"><span class="material-symbols-rounded">person_add</span>Sign Up</a>
            </div>
        </div>
    `;

    switch (pageType) {
        case 'Admin':
            document.querySelector('nav').innerHTML = adminLinks;
            break;
        case 'User':
            document.querySelector('nav').innerHTML = userLinks;
            break;
        default:
            document.querySelector('nav').innerHTML = guestLinks;
            break;
    }

    if (pageType === 'Guest') return;

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            window.location.replace('/login.html');
        });
    }
}
