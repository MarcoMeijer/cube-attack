import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { useStore } from "../hooks/useStore";
import { EnemyOne, EnemyThree, EnemyTwo } from "./Enemy";

export const Wave = () => {
    const { path, enemies } = useStore();

    const state = useRef({
        speed: 0.5,
        recharge: 0,
    });
    useFrame((_, delta) => {
        const s = state.current;
        s.recharge += delta;
        while (s.recharge > s.speed) {
            const enemy = EnemyThree();
            enemy.pos = path[0].clone();
            enemies.push(enemy);
            s.recharge -= s.speed;
        }
    });

    return <></>;
}
