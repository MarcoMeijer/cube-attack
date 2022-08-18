import { createContext, useContext } from "react";
import { Vector3 } from "three";

export const initialState = {
    enemies: [],
    towers: [],
    projectiles: [],
    wave: 0,
    path: [
        new Vector3(   8, 0,-0.5),
        new Vector3(   8, 0,   2),
        new Vector3(  12, 0,   2),
        new Vector3(  12, 0,  14),
        new Vector3(   9, 0,  14),
        new Vector3(   9, 0,  14),
        new Vector3(   9, 0,  11),
        new Vector3(  15, 0,  11),
        new Vector3(  15, 0,   6),
        new Vector3(   6, 0,   6),
        new Vector3(   6, 0,  13),
        new Vector3(   3, 0,  13),
        new Vector3(   3, 0,   3),
        new Vector3(   1, 0,   3),
        new Vector3(   1, 0,   8),
        new Vector3(-0.5, 0,   8),
    ]
};

export const StoreContext = createContext(initialState);

export const useStore = () => useContext(StoreContext).current;

