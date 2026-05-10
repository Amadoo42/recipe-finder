import { logout } from '/static/api/auth.js';

export function buildNav() {
    const path = window.location.pathname;

    var pageType = 'Guest';

    if (path.includes('/user/')) pageType = 'User';
    if (path.includes('/admin/')) pageType = 'Admin';

    const adminLinks = `
        <div class="NavContainer">
            <a class="NavBrand" href="/admin/">Recipe Finder</a>
            <div class="NavLinks">
                <a href="/admin/add/"><span class="material-symbols-rounded">add_circle</span>Add Recipe</a>
                <a href="/admin/explore/"><span class="material-symbols-rounded">visibility</span>View Recipes</a>
                <a href="/" id="logout-btn"><span class="material-symbols-rounded">logout</span>Logout</a>
            </div>
        </div>
    `;

    const userLinks = `
        <div class="NavContainer">
            <a class="NavBrand" href="/user/">Recipe Finder</a>
            <div class="NavLinks">
                <a href="/user/search/"><span class="material-symbols-rounded">search</span>Browse</a>
                <a href="/user/favourites/"><span class="material-symbols-rounded">favorite</span>Favourites</a>
                <a href="/" id="logout-btn"><span class="material-symbols-rounded">logout</span>Logout</a>
            </div>
        </div>
    `;

    const guestLinks = `
        <div class="NavContainer">
            <a class="NavBrand" href="/">Recipe Finder</a>
            <div class="NavLinks">
                <a href="/"><span class="material-symbols-rounded">home</span>Home</a>
                <a href="/login/"><span class="material-symbols-rounded">login</span>Login</a>
                <a href="/signup/"><span class="material-symbols-rounded">person_add</span>Sign Up</a>
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
        });
    }
}
