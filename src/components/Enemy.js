import { useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import { Object3D, Vector3 } from 'three';
import { useStore } from '../hooks/useStore';
import { movePath } from '../math/enemy';

const MAX_ENEMIES = 1000;

export function EnemyPool() {
    const mesh = useRef();
    const { path, enemies } = useStore();

    const dummy = useMemo(() => new Object3D(), []);

    // initial enemies
    useEffect(() => {
        for (let i=0; i<10; i++) {
            enemies.push({
                pos: new Vector3().add(path[0]),
                section: 0,
                speed: 3 - 0.1*i,
            });
        }
    }, []);

    useFrame((state, delta) => {
        enemies.forEach((enemy, i) => {
            const { pos, section, speed } = enemy;

            // if (pathStage === path.length)
            //     return;
            
            // move the enemy along the path
            const { section: newSection, pos: newPos } = movePath({
                path,
                section,
                speed,
                delta,
                start: pos
            })
            pos.copy(newPos);
            enemy.section = newSection;

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
