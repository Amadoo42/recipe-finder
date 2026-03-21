import { buildNav } from './nav.js';
import { loadGoogleFonts } from './utils/load-fonts.js';

export function initUI(user) {
    buildNav();
    loadGoogleFonts();

    // Pages are hidden by default. Show the hidden body of the page.
    document.body.classList.add('ready');
}
