/**
 * @brief Sets up the search input to call onSearch when triggered.
 * @param {Function} onSearch - Callback fired with the current query.
 */
export function setupSearch(onSearch) {
    const input = document.querySelector('#search input');
    

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            onSearch(input.value);
        }
    });

    input.addEventListener('input', () => {
        onSearch(input.value);
    });
}