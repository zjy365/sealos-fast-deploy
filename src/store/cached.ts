import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  insideCloud: boolean;
  cached: string;
  setCached: (e: string) => void;
  deleteCached: () => void;
  setinsideCloud: (e: boolean) => void;
};

export const useCachedStore = create<State>()(
  devtools(
    persist(
      immer((set, get) => ({
        cached: '',
        insideCloud: true,
        setCached(e: string) {
          set((state) => {
            state.cached = e;
          });
        },
        deleteCached() {
          set((state) => {
            state.cached = '';
          });
        },
        setinsideCloud(e: boolean) {
          set((state) => {
            state.insideCloud = e;
          });
        }
      })),
      { name: 'cached' }
    )
  )
);
