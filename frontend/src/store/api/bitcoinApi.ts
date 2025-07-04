import api from './api';
import { HomeApiResponse, PeersApiResponse } from '@/types';

export const bitcoinApi = {
   home: async (): Promise<HomeApiResponse> => {
      const { data } = await api.get<HomeApiResponse>('/bitcoin/home');
      return data;
   },

   peers: async (): Promise<PeersApiResponse> => {
      const { data } = await api.get<PeersApiResponse>('/bitcoin/peers');
      return data;
   },
};