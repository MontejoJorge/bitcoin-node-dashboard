import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from './api/api';
import { getToken, removeToken, setToken } from '@/utils/auth';

interface IUserStore {
   isLogged: boolean;
   jwt: string | undefined;
   loading: boolean;
   login(password: string, rememberMe: boolean): Promise<void>;
   logout(): unknown;
}

export const useUserStore = create<IUserStore>()(
   devtools((set) => ({
      isLogged: getToken() ? true : false,
      jwt: getToken(),
      loading: false,
      login: async (password, rememberMe) => {
         set({ loading: true });
         return api.post('auth/login', { password })
            .then(({data}) => {
               set({
                  isLogged: true,
                  jwt: data.jwt,
                  loading: false
               });
               setToken(data.jwt, rememberMe);
            })
            .catch((error) => {
               set({ loading: false });
               throw new Error(error.response.data.message);
            });
      },
      logout: () => {
         set({ isLogged: false, jwt: undefined });
         removeToken();
      }
   }))
);