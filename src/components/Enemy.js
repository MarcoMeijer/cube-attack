import { useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import { Object3D, Vector3 } from 'three';
import { useStore } from '../hooks/useStore';

const MAX_ENEMIES = 1000;

export function EnemyPool({ path }) {
    const mesh = useRef();
    const { enemies } = useStore();

    const dummy = useMemo(() => new Object3D(), []);

    // initial enemies
    useEffect(() => {
        for (let i=0; i<10; i++) {
            enemies.push({
                pos: new Vector3().add(path[0]),
                pathStage: 0,
                speed: 3 - 0.1*i,
            });
        }
    }, []);

    useFrame((state, delta) => {
        enemies.forEach((enemy, i) => {
            const { pos, pathStage, speed } = enemy;

            // if (pathStage === path.length)
            //     return;
            
            const dir = new Vector3().sub(pos).add(path[pathStage]);
            const vel = new Vector3().add(dir).normalize().multiplyScalar(delta*speed);
            if (vel.length() >= dir.length()) {
                pos.add(dir);
                enemy.pathStage += 1;
            } else {
                pos.add(vel);
            }

            // apply changes to dummy and to the instanced matrix
            dummy.position.copy(pos);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });

        mesh.current.count = enemies.length;
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, MAX_ENEMIES]} position-y={0.3}>
            <sphereGeometry args={[0.3]}/>
            <meshStandardMaterial color={0xff0000}/>
        </instancedMesh>
    );
}
