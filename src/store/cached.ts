import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  cached: string;
  setCached: (e: string) => void;
  deleteCached: () => void;
};

export const useCachedStore = create<State>()(
  devtools(
    persist(
      immer((set, get) => ({
        cached: '',
        setCached(e: string) {
          set((state) => {
            state.cached = e;
          });
        },
        deleteCached() {
          set((state) => {
            state.cached = '';
          });
        }
      })),
      { name: 'cached' }
    )
  )
);
