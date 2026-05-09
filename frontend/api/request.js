function getCSRFToken() {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='))
    ?.split('=')[1];
}

export async function getRequest(url, params) {
    if (params) url = url+`?${params.toString()}`;
    const response = await fetch(url);
    const result = await response.json();
    return result;
}

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