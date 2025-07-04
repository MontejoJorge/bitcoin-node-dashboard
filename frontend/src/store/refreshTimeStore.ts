import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type RefreshTimeStore = {
   refreshTime: number;
   setRefreshTime: (time: number) => void;
}

export const useRefreshTimeStore = create<RefreshTimeStore>()(
   devtools(
      persist(
         (set) => ({
            refreshTime: 15000,
            setRefreshTime: (time: number) => set({ refreshTime: time }),
         }),
         {
            name: 'refreshTime',
         }
      )
   )
);