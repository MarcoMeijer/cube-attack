import { Vector3 } from "three";

const createStore = () => {
    const state = {
        enemies: [],
        towers: [],
        projectiles: [],
        path: [
            new Vector3( 0, 0,  0),
            new Vector3( 0, 0, 10),
            new Vector3(10, 0, 10),
            new Vector3(10, 0, 15),
            new Vector3( 5, 0, 15),
            new Vector3( 5, 0,  0),
            new Vector3( 0, 0,  0),
        ]
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
