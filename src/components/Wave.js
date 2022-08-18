import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useStore } from "../hooks/useStore";
import { EnemyOne, EnemyThree, EnemyTwo } from "./Enemy";

const waves = [
    [[EnemyOne, 5, 0.6]], // wave 1
    [[EnemyOne, 10, 0.4]], // wave 2
    [[EnemyOne, 10, 0.4], [EnemyTwo, 2, 2]], // wave 3
    [[EnemyThree, 100, 0.02]] // wave 4
];

export const Wave = () => {
    let { path, enemies, setStore, wave } = useStore();

    const state = useRef({
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
