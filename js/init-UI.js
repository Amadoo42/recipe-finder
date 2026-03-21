import { buildNav } from './nav.js';
import { loadGoogleFonts } from './utils/load-fonts.js';

export function initUI(user) {
    buildNav();
    loadGoogleFonts();

    // add user data
    if (user) {

        const DATA_FIELDS = ['firstName', 'lastName', 'username', 'email', 'role'];

        DATA_FIELDS.forEach(field => {
            if (user[field]) {
                document.querySelectorAll(`[data-${field}]`).forEach(dataField => {
                    dataField.textContent = user[field];
                });
            }
        });
    }

    // Pages are hidden by default. Show the hidden body of the page.
    document.body.classList.add('ready');
}
