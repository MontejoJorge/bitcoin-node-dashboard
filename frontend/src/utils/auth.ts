import Cookies from 'js-cookie';

const tokenKey = 'token';

export function getToken() {
   return Cookies.get(tokenKey) || localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey) || undefined;
}

export function setToken(token: string, rememberMe: boolean) {
   Cookies.remove(tokenKey);
   localStorage.removeItem(tokenKey);
   sessionStorage.removeItem(tokenKey);
   
   if (rememberMe) {
      Cookies.set(tokenKey, token);
   } else {
      sessionStorage.setItem(tokenKey, token);
   }
}

export function removeToken() {
   Cookies.remove(tokenKey);
   localStorage.removeItem(tokenKey);
   sessionStorage.removeItem(tokenKey);
}
