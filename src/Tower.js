import React from 'react';
import { useGLTF } from '@react-three/drei';

export function Tower(props) {
    const { nodes } = useGLTF("/castle.glb");
    return (
        <group {...props} dispose={null}>
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cylinder.geometry}
                material={nodes.Cylinder.material}
                position={[0, 1.5, 0]}
            />
        </group>
    );
}

useGLTF.preload("/castle.glb");
