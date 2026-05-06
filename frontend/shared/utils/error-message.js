function toggleErrorMessage(element, show, message = null) {
    if (message) {
        element.textContent = message;
    }
    element.classList.toggle('show', show);
}

// toggles the display of a list of error messages
export function toggleErrorMessageList(list, show, errorKeys) {
    let errorMessageList = [];
    if (errorKeys) {
        for (const key in errorKeys) {
            errorMessageList.push(list[key]);
        }
    }
    else {
        errorMessageList = Object.values(list);
    }

    for (const errorMessage of errorMessageList) {
        toggleErrorMessage(errorMessage, show);
    }
}