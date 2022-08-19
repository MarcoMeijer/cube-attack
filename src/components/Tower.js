import React, { useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Object3D, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from '../hooks/useStore';
import { calculateProjectileVelocity } from '../math/projectile';

const MAX_TOWERS = 100;

export const Castle = (pos) => {
    const tower = {
        pos,
        type: 0,
        fireRate: 0.4,
        recharge: 0,
        timer: 0,
    };

    tower.onTick = (store, delta) => {
        const { path, enemies, projectiles } = store;

        const { fireRate } = tower;
        tower.recharge += delta;

        while (tower.recharge > fireRate) {
            const pos = tower.pos.clone().add(new Vector3(0, 1.2, 0));
            const radius = 4;
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
                enemy.futureDamage(1);
                projectiles.push({
                    pos,
                    target: enemy,
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
    }

    return tower;
}

export const FreezeTower = (pos) => {
    const tower = {
        pos,
        type: 1,
        fireRate: 0.5,
        recharge: 0,
        timer: 0,
    };

    tower.onTick = (store, delta) => {
        const { enemies } = store;

        const { fireRate } = tower;
        tower.recharge += delta;

        while (tower.recharge > fireRate) {
            const radius = 4;
            const targets = enemies.filter((enemy) => enemy.futureHealth > 0
                && tower.pos.clone().sub(enemy.pos).length() < radius
            );

            for (const target of targets) {
                if (target.frozenTime === 0) {
                    target.speed /= 2;
                }
                target.frozenTime = 1;
            }
            tower.recharge -= fireRate;
        }
    }

    return tower;
}

export const AreaTower = (pos) => {
    const tower = {
        pos,
        type: 2,
        fireRate: 0.7,
        recharge: 0,
        timer: 0,
    };

    tower.onTick = (store, delta) => {
        const { projectiles } = store;

        const { fireRate } = tower;
        tower.recharge += delta;

        while (tower.recharge > fireRate) {
            for (let i=0; i<8; i++) {
                const pos = tower.pos.clone().add(new Vector3(0, 0.3, 0));
                projectiles.push({
                    pos,
                    vel: new Vector3(4, -0.8, 0).applyAxisAngle(new Vector3(0, 1, 0), i*Math.PI/4),
                });
            }
            tower.recharge -= fireRate;
        }
    }

    return tower;
}

export const TowerPool = () => {
    const mesh = [useRef(), useRef(), useRef()];
    const store = useStore();
    const { towers } = store;
    const { nodes: nodes1 } = useGLTF("/castle.glb");
    const { nodes: nodes2 } = useGLTF("/frozen.glb");
    const { nodes: nodes3 } = useGLTF("/area.glb");

    const dummy = useMemo(() => new Object3D(), []);

    useFrame((state, delta) => {
        // animation
        towers.forEach((tower) => {
            tower.timer += delta;
        });

        for (let i=0; i<3; i++) {
            let j = 0;
            towers.forEach((tower) => {
                if (tower.type === i) {
                    tower.onTick(store, delta);

                    // apply changes to dummy and to the instanced matrix
                    dummy.position.copy(tower.pos);
                    if (tower.timer < 0.5) {
                        const x = tower.timer*2;
                        dummy.scale.copy(new Vector3(1,1,1).multiplyScalar(Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * 1) + 1))
                    } else {
                        dummy.scale.copy(new Vector3(1,1,1));
                    }
                    dummy.updateMatrix();
                    mesh[i].current.setMatrixAt(j, dummy.matrix);
                    j++;
                }
            });

            mesh[i].current.instanceMatrix.needsUpdate = true;
        }
    });

    return (
        <>
            <instancedMesh
                geometry={nodes1.Cylinder.geometry}
                material={nodes1.Cylinder.material}
                args={[null, null, MAX_TOWERS]}
                ref={mesh[0]}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial color={0x882288}/>
            </instancedMesh>
            <instancedMesh
                geometry={nodes2.Icosphere.geometry}
                material={nodes2.Icosphere.material}
                args={[null, null, MAX_TOWERS]}
                ref={mesh[1]}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial color={0x4444aa}/>
            </instancedMesh>
            <instancedMesh
                geometry={nodes3.Cone.geometry}
                material={nodes3.Cone.material}
                args={[null, null, MAX_TOWERS]}
                ref={mesh[2]}
                castShadow
                receiveShadow
            >
                <meshStandardMaterial color={0xaaaa44}/>
            </instancedMesh>
        </>
    );
}

useGLTF.preload("/castle.glb");
useGLTF.preload("/frozen.glb");
useGLTF.preload("/area.glb");
