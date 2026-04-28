export const PAGE_AUTH_LEVEL = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    ADMIN: 'admin',
    USER: 'user'
};

export const REDIRECT = {
    TO_LOGIN: () => window.location.replace('/login/'),
    TO_USER: () => window.location.replace('/user/dashboard/'),
    TO_ADMIN: () => window.location.replace('/admins/')
};