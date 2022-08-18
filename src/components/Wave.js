import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useStore } from "../hooks/useStore";
import { EnemyOne, EnemyThree, EnemyTwo } from "./Enemy";

const waves = [
    [[EnemyOne, 5, 1]], // wave 1
    [[EnemyOne, 10, 0.8]], // wave 2
    [[EnemyOne, 10, 0.8], [EnemyTwo, 2, 2]], // wave 3
    [[EnemyThree, 100, 0.02]] // wave 4
];

export const Wave = () => {
    const { path, enemies } = useStore();

    const state = useRef({
        wave: 0,
        group: 0,
        enemy: 0,
        betweenWave: 5,
        started: true,
        recharge: 0,
    });
    useFrame((_, delta) => {
        const s = state.current;
        s.recharge += delta;
        while (s.started || s.recharge >= s.betweenWave) {
            if (s.wave >= waves.length) {
                return;
            }
            if (!s.started) {
                s.recharge -= s.betweenWave;
                s.started = true;
            }
            while (s.started && s.recharge >= waves[s.wave][s.group][2]) {
                s.recharge -= waves[s.wave][s.group][2];
                const enemy = waves[s.wave][s.group][0]();
                enemy.pos = path[0].clone();
                enemies.push(enemy);
                s.enemy++;
                if (s.enemy === waves[s.wave][s.group][1]) {
                    s.enemy = 0;
                    s.group++;
                    if (s.group === waves[s.wave].length) {
                        s.group = 0;
                        s.wave++;
                        s.started = false;
                    }
                }
            }
            if (s.started) {
                break;
            }
        }
    });

    return <></>;
}
