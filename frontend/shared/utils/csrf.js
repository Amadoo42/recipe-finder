export function getCsrfToken(){
    const cookies = document.cookie.split(';');
    for(const cookie of cookies){
        const [name,value] = cookie.trim().split('=');
        if(name ==='csrftoken'){
            return decodeURIComponent(value);
        }
    }
    console.warn('CSRF token not found in cookies. Are you logged in?');
    return '';
}