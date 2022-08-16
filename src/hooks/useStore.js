import { Vector3 } from "three";

const createStore = () => {
    const state = {
        enemies: [],
        towers: [],
        projectiles: [],
        path: [
            new Vector3(   8, 0,-0.5),
            new Vector3(   8, 0,  2),
            new Vector3(  12, 0,  2),
            new Vector3(  12, 0, 14),
            new Vector3(   9, 0, 14),
            new Vector3(   9, 0, 14),
            new Vector3(   9, 0, 11),
            new Vector3(  15, 0, 11),
            new Vector3(  15, 0,  6),
            new Vector3(   6, 0,  6),
            new Vector3(   6, 0, 13),
            new Vector3(   3, 0, 13),
            new Vector3(   3, 0,  3),
            new Vector3(   1, 0,  3),
            new Vector3(   1, 0,  8),
            new Vector3(-0.5, 0,  8),
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
