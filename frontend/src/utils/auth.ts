const tokenKey = 'token';

export function getToken() {
   return localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey) || undefined;
}

export function setToken(token: string, rememberMe: boolean) {
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
