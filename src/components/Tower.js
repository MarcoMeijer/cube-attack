import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Object3D, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../hooks/useStore';
import { calculateProjectileVelocity } from '../math/projectile';

const MAX_TOWERS = 1000;

export function TowerPool() {
    const mesh = useRef();
    const { path, enemies, towers, projectiles } = useStore();
    const { nodes } = useGLTF("/castle.glb");

    const dummy = useMemo(() => new Object3D(), []);

    // initial towers
    useEffect(() => {
        towers.push({
            pos: new Vector3(3, 0, 3),
            fireRate: 1,
            recharge: 0,
        });
        towers.push({
            pos: new Vector3(7, 0, 8),
            fireRate: 2,
            recharge: 0,
        });
    }, []);

    useFrame((state, delta) => {
        towers.forEach((tower, i) => {
            const { fireRate } = tower;
            tower.recharge += delta;

            while (tower.recharge > fireRate) {
                const pos = tower.pos.clone().add(new Vector3(0, 3, 0));
                const radius = 7;
                const speed = 10;
                const targets = enemies.filter((enemy) => enemy.futureHealth > 0
                    && (calculateProjectileVelocity({
                        path,
                        speed,
                        radius,
                        source: pos,
                        target: enemy,
                    }) !== null)
                );

                if (targets.length) {
                    const enemy = targets[0];
                    projectiles.push({
                        pos: pos,
                        vel: calculateProjectileVelocity({
                            path,
                            speed,
                            radius,
                            source: pos,
                            target: enemy,
                        }),
                    });
                }
                tower.recharge -= fireRate;
            }

            // apply changes to dummy and to the instanced matrix
            dummy.position.copy(tower.pos);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });

        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            castShadow
            receiveShadow
            geometry={nodes.Cylinder.geometry}
            material={nodes.Cylinder.material}
            position-y={1.5}
            args={[null, null, MAX_TOWERS]}
            ref={mesh}
        />
    );
}

useGLTF.preload("/castle.glb");