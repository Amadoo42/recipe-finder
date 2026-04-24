// Logic for handling image data conversion and URL validation.
import { createMessage } from "./create-message.js";

// checks if a given image url is valid by trying to load it into an image object
async function checkImageExists(url) {
    const result = new Promise((resolve, reject) => {
        if (!url.startsWith("http")) reject(new Error("Invalid URL"));
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Invalid URL"));
    });
    return result;
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

    if (!url) return createMessage(true, "No URL specified");
    
    try {
        await checkImageExists(url)
        return createMessage(true, "URL is valid", url);
    }
    catch(error) {
        console.log(error);
        return createMessage(false, "URL is invalid");
    }
}