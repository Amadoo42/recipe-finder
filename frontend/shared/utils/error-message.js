export function toggleErrorMessage(element, show, message = null) {
    if (message) {
        element.textContent = message;
    }
    element.classList.toggle('show', show);
}