/**
 * @brief Sets up the search input and button to call onSearch when triggered.
 * @param {Function} onSearch - Callback fired with the current query.
 */
export function setupSearch(onSearch) {
    const input = document.querySelector('#search input');
    const button = document.querySelector('#search button');

    button.addEventListener('click', () => {
        onSearch(input.value);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            onSearch(input.value);
        }
    });

    input.addEventListener('input', () => {
        onSearch(input.value);
    });
}