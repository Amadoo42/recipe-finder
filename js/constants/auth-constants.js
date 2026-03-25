export const PAGE_AUTH_LEVEL = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    ADMIN: 'admin',
    USER: 'user'
};

export const REDIRECT = {
    TO_LOGIN: () => window.location.replace('/login.html'),
    TO_USER: () => window.location.replace('/user/dashboard.html'),
    TO_ADMIN: () => window.location.replace('/admin/dashboard.html')
};