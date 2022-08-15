
const createStore = () => {
    const state = {
        enemies: [],
        towers: [],
    };

    const setStore = (props) => {
        for (const key in props) {
            state[key] = props[key];
        }
    }

    state.setStore = setStore;

    return () => {
        return state;
    };
};

export const useStore = createStore();
