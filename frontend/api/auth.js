import { initUI } from '/static/shared/js/init-UI.js';

export class API {
    #BASE = ''

    getCookie(name) {
        return document.cookie
            .split('; ')
            .find(row => row.startsWith(name + '='))
            ?.split('=')[1];
    }

    setBase(base) {
        this.#BASE = base;
    }

    getBase() {
        return this.#BASE;
    }

    async request(endpoint, method = 'GET', body = null) {

        const full_url = this.#BASE + endpoint; // remember to add a '/' at the end of base

        const _request = {
            method: method,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': this.getCookie('csrftoken'),
            }
        }

        if (body) {
            _request['body'] = JSON.stringify(body)
        }

        return await fetch(full_url, _request);
    }
}

export async function logout() {
    const api = new API();
    api.setBase('/');

    const response = await api.request('logout_API/', 'POST');
    const message = await response.json();

    if (message.success == false) {
        console.log(message);
        return;
    }

    alert(message.description);
    window.location.replace(message.data)
}

document.addEventListener('DOMContentLoaded', () => {
    initUI();
});