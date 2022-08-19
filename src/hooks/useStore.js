import { createContext, useContext } from "react";
import { Vector3 } from "three";
import { AreaTower, Castle } from "../components/Tower";

export const initialState = {
    enemies: [],
    towers: [],
    projectiles: [],
    wave: 0,
    health: 100,
    money: 200,
    gameOver: false,
    selectedTower: Castle,
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

