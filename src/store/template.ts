import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type State = {
  template: string;
  setTemplate: (e: string) => void;
  deleteTemplate: () => void;
};

export const useGlobalStore = create<State>()(
  devtools(
    immer((set, get) => ({
      template: '',
      setTemplate(e: string) {
        set((state) => {
          state.template = e;
        });
      },
      deleteTemplate() {
        set((state) => {
          state.template = '';
        });
      }
    }))
  )
);
