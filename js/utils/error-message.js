
/**
 * @summary Handles the success/failure messages and displays it to the user
 * @param {Message} message The message object to display
 */
export function handleStatusMessage(message) {
    const messageElement = document.querySelector('.StatusMessage');
    if (!messageElement || !message) return;
    messageElement.textContent = message.description;
    messageElement.classList.toggle('Success', message.success);
    messageElement.classList.toggle('Error', !message.success);
}

/**
 * @summary Clears the status message from the UI and resets its styling
 */
export function clearMessage() {
    const messageElement = document.querySelector('.StatusMessage');
    if (!messageElement) return;
    messageElement.textContent = '';
    messageElement.classList.remove('Success', 'Error');
}