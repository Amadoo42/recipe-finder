// Logic for handling image data conversion and URL validation.

function toggleUIComponent(component, value) {
    component.classList.toggle("show", value);
}

// checks if a given image url is valid by trying to load it into an image object
async function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true); 
        img.onerror = () => resolve(false);
        img.src = url; 
    });
}

// Converts a local into a base64 string
export async function processUploadedImage(imageInputElement) {
    let imageData = "";
    const toBase64 = file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    });
    if (imageInputElement && imageInputElement.files && imageInputElement.files.length > 0) {
        imageData = await toBase64(imageInputElement.files[0]);
    }
    return imageData
}

// Validates an online image URL and returns the URL string if valid
export async function processOnlineImageURL(imageInputElement, errorMessageElement) {
    let imageData = "";
    let validImage = true;
    const url = imageInputElement.value.trim();

    if (url) {
        const exists = await checkImageExists(url);
        if (exists) {
            imageData = url;
            toggleUIComponent(errorMessageElement, false);
        }
        else {
            toggleUIComponent(errorMessageElement, true);
            validImage = false;
        }
    }
    else {
        toggleUIComponent(errorMessageElement, false);
    }
    return {imageData: imageData, valid: validImage};
}