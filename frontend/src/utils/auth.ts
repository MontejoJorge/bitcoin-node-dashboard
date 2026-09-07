const tokenKey = 'token';

export function getToken() {
   return localStorage.getItem(tokenKey) || undefined;
}

export function setToken(token: string) {
   localStorage.setItem(tokenKey, token);
}

export function removeToken() {
   localStorage.removeItem(tokenKey);
}
