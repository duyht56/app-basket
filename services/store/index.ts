import { createStore } from 'SHELL/Store';

// Documentation https://www.npmjs.com/package/zustand


export interface IState {
    count: number;
    increasePopulation: () => void;
    removeAll: () => void
}

export const useStore = createStore<IState>((set: SetState<IState>) => ({
    count: 0,
    increasePopulation: () =>
        set((state: { count: number }) => ({ count: state.count + 1 })),
    removeAll: () => set({ count: 0 }),
}));