export function getCsrfToken(){
    const cookies = document.cookie.split(';');
    for(cookie in cookies){
        const [name,value] = cookie.trim().split('=');
        if(name ==='csrftoken'){
            return decodeURIComponent(value);
        }
    }
    console.warn('CSRF token not found in cookies. Are you logged in?');
    return '';
}