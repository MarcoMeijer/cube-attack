import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useStore } from "../hooks/useStore";
import { EnemyOne, EnemyThree, EnemyTwo } from "./Enemy";

const wave13 = () => {
    const res = [];
    for (let i=0; i<100; i++) {
        res.push([(i%2 ? EnemyOne : EnemyTwo), 1, 0.1]);
    }
    return res;
}

const waves = [
    [[EnemyOne, 5, 0.6]], // wave 1
    [[EnemyOne, 10, 0.4]], // wave 2
    [[EnemyOne, 10, 0.4], [EnemyTwo, 2, 2]], // wave 3
    [[EnemyOne, 40, 0.2]], // wave 4
    [[EnemyOne, 20, 0.2], [EnemyTwo, 10, 0.5]], // wave 5
    [[EnemyTwo, 20, 0.5]], // wave 6
    [[EnemyThree, 10, 0.7]], // wave 7
    [[EnemyThree, 5, 0.5], [EnemyOne, 40, 0.2], [EnemyTwo, 5, 0.5]], // wave 8
    [[EnemyTwo, 20, 0.2]], // wave 9
    [[EnemyThree, 20, 0.5]], // wave 10
    [[EnemyOne, 100, 0.1]], // wave 11
    [[EnemyTwo, 50, 0.2]], // wave 12
    wave13(), // wave 13
    [[EnemyThree, 100, 0.02]] // last wave
];

export const Wave = () => {
    let { path, enemies, setStore, wave } = useStore();

    const state = useRef({
        group: 0,
        enemy: 0,
        betweenWave: 8,
        started: true,
        recharge: 0,
    });

    useFrame((_, delta) => {
        const s = state.current;
        s.recharge += delta;
        while (s.started || s.recharge >= s.betweenWave) {
            if (wave >= waves.length) {
                break;
            }
            if (!s.started) {
                s.recharge -= s.betweenWave;
                s.started = true;
            }
            while (s.started && s.recharge >= waves[wave][s.group][2]) {
                s.recharge -= waves[wave][s.group][2];
                const enemy = waves[wave][s.group][0]();
                enemy.pos = path[0].clone();
                enemies.push(enemy);
                s.enemy++;
                if (s.enemy === waves[wave][s.group][1]) {
                    s.enemy = 0;
                    s.group++;
                    if (s.group === waves[wave].length) {
                        s.group = 0;
                        wave++;
                        s.started = false;
                    }
                }
            }
            if (s.started) {
                break;
            }
        }
        setStore(() => ({ wave }));
    });

    return <></>;
}
