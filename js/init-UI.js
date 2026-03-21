import { buildNav } from './nav.js';

export function initUI(user) {
    buildNav();

    // Pages are hidden by default. Show the hidden body of the page.
    document.body.classList.add('ready');
}
