/**
 * @brief Dynamically injects Google Fonts into the document head.
 * * @details Specifically, it:
 * - Creates preconnect links for each required font.
 * - Serves as a robust font injector and a single point of change to apply to all pages.
 * - Appends a link element for the Great Vibes CSS stylesheet.
 * * @return {void} This function does not return a value.
 */
export function loadGoogleFonts() {
    const head = document.head;

    // preconnect 1
    const link1 = document.createElement('link');
    link1.rel = 'preconnect';
    link1.href = 'https://fonts.googleapis.com';

    // preconnect 2
    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.setAttribute('crossorigin', '');

    // font 1
    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href =
        'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';
        
    // font 2
    const link4 = document.createElement('link');
    link4.rel = 'stylesheet';
    link4.href =
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap';

    // icons
    const link5 = document.createElement('link');
    link5.rel = 'stylesheet';
    link5.href = 
        'https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0,0';

    head.append(link1);
    head.append(link2);
    head.append(link3);
    head.append(link4);
    head.append(link5);
}
