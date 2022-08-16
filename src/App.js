import './styles.css';
import React, { useRef } from 'react';
import { OrbitControls, Stars, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { EnemyPool } from './components/Enemy';
import { TowerPool } from './components/Tower';
import { ProjectilePool } from './components/Projectile';
import { Effects } from './components/Effects';
import { Floor } from './components/Floor';

export function Model(props) {
    const lid = useRef();
    const handleL= useRef();
    const handleR = useRef();
    const { nodes, materials } = useGLTF("/chest.glb");

    const speed = 2;

    useFrame(({ clock }) => {
        lid.current.rotation.x = Math.sin(clock.getElapsedTime() * speed) - 1.0;
        for (const handle of [handleL, handleR]) {
            handle.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.8)*0.2;
        }
    });

    return (
        <group {...props} dispose={null}>
            <mesh
                ref={handleL}
                castShadow
                receiveShadow
                geometry={nodes.treasure_chest_handle_left.geometry}
                material={materials["treasure_chest.005"]}
                position={[-0.47, 0.29, 0]}
            />
            <mesh
                ref={handleR}
                castShadow
                receiveShadow
                geometry={nodes.treasure_chest_handle_right.geometry}
                material={materials["treasure_chest.005"]}
                position={[0.47, 0.29, 0]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.treasure_chest_lock.geometry}
                material={materials["treasure_chest.005"]}
                position={[0, 0.42, 0.26]}
            />
            <mesh
                castShadow
                receiveShadow
                geometry={nodes.treasure_chest_bottom.geometry}
                material={materials["treasure_chest.005"]}
                position={[0, 0.02, 0]}
            />
            <mesh
                ref={lid}
                castShadow
                receiveShadow
                geometry={nodes.treasure_chest_lid.geometry}
                material={materials["treasure_chest.005"]}
                position={[0, 0.42, -0.26]}
            />
        </group>
    );
}

useGLTF.preload("/chest.glb");

const App = () => {
    return (
        <Canvas mode="concurrent" camera={{ position: [8.5, 10, 20]}}>
            <Floor />
            <fog color="#b8bfbe" attach="fog" near={100} far={200} />
            <TowerPool />
            <EnemyPool />
            <ProjectilePool />
            <OrbitControls enablePan={false} target-x={8.5} target-z={8.5}/>
            <Stars radius={100} depth={50} count={5000} factor={8} saturation={1} fade speed={2} />
            <Effects />
            <ambientLight intensity={1}/>
            {/* <Environment files="/je_gray_park_2k.hdr" /> */}
        </Canvas>
    );
}

export default App;
