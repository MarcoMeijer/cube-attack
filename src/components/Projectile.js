import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import { Object3D } from "three";
import { useStore } from "../hooks/useStore";

const MAX_PROJECTILES = 10000;

export function ProjectilePool() {
    const mesh = useRef();
    let { projectiles, enemies, setStore } = useStore();

    const dummy = useMemo(() => new Object3D(), []);

    useFrame((state, delta) => {
        projectiles.forEach((projectile, i) => {
            const { pos, vel } = projectile;

            pos.add(vel.clone().multiplyScalar(delta));

            // apply changes to dummy and to the instanced matrix
            dummy.position.copy(pos.clone());
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });

        // check if it hit an enemy
        const newProjectiles = projectiles.filter((projectile, i) => {
            const { pos, target } = projectile;

            const tryHitEnemy = (enemy) => {
                if (enemy.pos.clone().sub(pos).length() < 0.4) { // todo: don't hardcode the distance
                    enemy.promisedDamage(1);
                    if (enemy.health <= 0) {
                        enemies.splice(enemies.indexOf(enemy), 1);
                        setStore(({money}) => {
                            return {money: money + enemy.money};
                        });
                        for (const child of enemy.children) {
                            enemies.push(child(enemy));
                        }
                    }
                    return true;
                }
                return false;
            }

            if (target === undefined) {
                for (const enemy of enemies) {
                    if (tryHitEnemy(enemy)) {
                        return false;
                    }
                }
            } else {
                if (tryHitEnemy(target)) {
                    return false;
                }
            }

            return pos.y > -0.2;
        });
        projectiles.length = 0;
        projectiles.push(...newProjectiles);


        mesh.current.count = projectiles.length;
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, MAX_PROJECTILES]} position-y={0.3}>
            <sphereGeometry args={[0.05]}/>
            <meshStandardMaterial color={0xffffff}/>
        </instancedMesh>
    );
}