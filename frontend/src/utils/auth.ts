const tokenKey = 'token';

export function getToken() {
   // Check localStorage first (for remembered sessions), then sessionStorage
   return localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey) || undefined;
}

export function setToken(token: string, rememberMe: boolean) {
   // Clear any existing token from both storages to avoid conflicts
   localStorage.removeItem(tokenKey);
   sessionStorage.removeItem(tokenKey);
   
   if (rememberMe) {
      localStorage.setItem(tokenKey, token);
   } else {
      sessionStorage.setItem(tokenKey, token);
   }
}

export function removeToken() {
   localStorage.removeItem(tokenKey);
   sessionStorage.removeItem(tokenKey);
}