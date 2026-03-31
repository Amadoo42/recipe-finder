/**
 * @brief Sets up the filter buttons to call onFilter when a category is selected.
 * @param {Function} onFilter - Callback fired with the selected category.
 */
export function setupFilters(onFilter) {
    const filterButtons = document.querySelectorAll('#filters button');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            onFilter(btn.dataset.category);
        });
    });
}