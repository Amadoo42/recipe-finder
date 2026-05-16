const SALT = "FCAI_2026_SECRET_KEY"; // Makes the "hash" unique to our app

export function hash(password) {
    const saltedPassword = password + SALT;
    
    const scrambled = btoa(saltedPassword);
    
    return scrambled.split('').reverse().join('');
}