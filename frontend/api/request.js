/**
 * Retrieves the CSRF token from the document cookies.
 * @returns { string | undefined } - The CSRF token value if found, otherwise undefined.
 */
function getCSRFToken() {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
}

/**
 * Performs a GET request to the specified URL with optional parameters.
 * @param { string } url - The endpoint URL.
 * @param { URLSearchParams } [params] - Optional query parameters.
 * @returns { Promise<any> } - The parsed JSON response from the server.
 */
export async function getRequest(url, params) {
    if (params) url = url+`?${params.toString()}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
}

/**
 * Performs a POST request with data wrapped in FormData and includes the CSRF token.
 * @param { string } url - The endpoint URL.
 * @param { Object } data - An object containing key-value pairs to be sent as FormData.
 * @returns { Promise<any> } - The parsed JSON response from the server.
 */
export async function postRequest(url, data) {
    const formData = new FormData();
    for (const key in data) {
        formData.append(key, data[key]);
    }
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            "X-CSRFToken": getCSRFToken()
        },
        body: formData
    })
    const result = await response.json();
    return result;
}

/**
 * Performs a DELETE request to the specified URL with specified data.
 * @param { string } url - The endpoint URL.
 * @param { Object } data - A JSON object that contains body data.
 * @returns { Promise<any> } - The parsed JSON response from the server.
 */
export async function deleteRequest(url, data) {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCSRFToken()
        },
        body: JSON.stringify(data)
    })

    const result = await response.json();
    return result
}