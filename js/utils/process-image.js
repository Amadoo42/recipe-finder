// Logic for handling image data conversion and URL validation.
import { createMessage } from "./create-message.js";

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
    const toBase64 = file => new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
    });
    if (imageInputElement && imageInputElement.files && imageInputElement.files.length > 0) {
        const imageData = await toBase64(imageInputElement.files[0]);
        return createMessage(true, "Local image stored successfully", imageData);
    }
    return createMessage(true, "No local image specified");
}

// Validates an online image URL and returns the URL string if valid
export async function processOnlineImageURL(imageInputElement) {
    const url = imageInputElement.value.trim();

    if (url) {
        const exists = await checkImageExists(url);
        if (exists) {
            return createMessage(true, "URL is valid", url);
        }
        else {
            return createMessage(false, "URL is invalid");
        }
    }
    else {
        return createMessage(true, "No URL specified");
    }
}