import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from './api/api';
import { getToken, removeToken, setToken } from '@/utils/auth';

type UserStore = {
   isLogged: boolean;
   jwt: string | undefined;
   loading: boolean;
   login(password: string): Promise<void>;
   logout(): unknown;
};

export const useUserStore = create<UserStore>()(
   devtools((set) => ({
      isLogged: getToken() ? true : false,
      jwt: getToken(),
      loading: false,
      login: async (password) => {
         set({ loading: true });
         return api.post('auth/login', { password })
            .then(({data}) => {
               set({
                  isLogged: true,
                  jwt: data.jwt,
                  loading: false
               });
               setToken(data.jwt);
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