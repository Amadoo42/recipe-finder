import { logout } from './auth.js';

export function buildNav() {
    const path = window.location.pathname;

    var pageType = 'Guest';

    if (path.includes('/user/')) pageType = 'User';
    if (path.includes('/admin/')) pageType = 'Admin';

    const adminLinks = `
      <a href="/admin/dashboard.html">Admin Dashboard</a> |
      <a href="/admin/add-recipe.html">Add New Recipe</a> |
      <a href="/admin/view-recipe.html">View Recipes</a> |
      <a href="../index.html" id='logout-btn'>Logout</a>
    `;

    const userLinks = `
      <a href="/user/dashboard.html">User Dashboard</a> |
      <a href="/user/search.html">Search & Browse</a> |
      <a href="/user/favourites.html">My Favourites</a> |
      <a href="../index.html" id='logout-btn'>Logout</a>
    `;

    const guestLinks = `
      <a href="/index.html">Home</a> |
      <a href="/login.html">Login</a> |
      <a href="/signup.html">Sign Up</a>
    `;

    console.log(pageType);

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
