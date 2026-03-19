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

    // stylesheet
    const link3 = document.createElement('link');
    link3.rel = 'stylesheet';
    link3.href =
        'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap';

    head.append(link1);
    head.append(link2);
    head.append(link3);
}
