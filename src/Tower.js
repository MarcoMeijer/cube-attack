import React, { useEffect, useMemo, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { Object3D, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useStore } from './hooks/useStore';

const MAX_TOWERS = 1000;

export function TowerPool() {
    const mesh = useRef();
    const { towers } = useStore();
    const { nodes } = useGLTF("/castle.glb");

    const dummy = useMemo(() => new Object3D(), []);

    // initial towers
    useEffect(() => {
        towers.push({
            pos: new Vector3(3, 0, 3),
        });
        towers.push({
            pos: new Vector3(7, 0, 8),
        });
    }, []);

    useFrame((state, delta) => {
        towers.forEach((tower, i) => {
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
            position={[0, 1.5, 0]}
            args={[null, null, MAX_TOWERS]}
            ref={mesh}
        />
    );
}

useGLTF.preload("/castle.glb");
