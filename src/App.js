import './styles.css';
import React, { useRef } from 'react';
import { Environment, OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { EnemyPool } from './components/Enemy';
import { TowerPool } from './components/Tower';
import { ProjectilePool } from './components/Projectile';
import { useStore } from './hooks/useStore';

function Floor() {
    const [colorMap, normalMap, roughnessMap] = useTexture([
        '/forrest_ground_01_diff_1k.jpg',
        '/forrest_ground_01_nor_gl_1k.jpg',
        '/forrest_ground_01_rough_1k.jpg'
    ]);

    useThree(({camera}) => {
        camera.rotation.set(-1.2, 0, 0);
        camera.position.set(5, 16, 12);
    });

    const { towers } = useStore();

    return (
        <mesh rotation-x={Math.PI * -0.5} onClick={e => {
            const pos = e.intersections[0].point;
            towers.push({
                pos,
                fireRate: 0.4,
                recharge: 0,
            });
        }}>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial
                map={colorMap}
                map-wrapS={THREE.RepeatWrapping}
                map-wrapT={THREE.RepeatWrapping}
                map-repeat={[60, 60]}
                normalMap={normalMap}
                normalMap-wrapS={THREE.RepeatWrapping}
                normalMap-wrapT={THREE.RepeatWrapping}
                normalMap-encoding={THREE.LinearEncoding}
                normalMapScale={[1, 1]}
                roughness={1}
                roughnessMap={roughnessMap}
                roughnessMap-wrapS={THREE.RepeatWrapping}
                roughnessMap-wrapT={THREE.RepeatWrapping}
            />
        </mesh>
    )
}

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
        <Canvas>
            <Floor />
            <fog color="#b8bfbe" attach="fog" near={100} far={200} />
            <TowerPool />
            <EnemyPool />
            <ProjectilePool />
            <Environment background={true} files="/je_gray_park_2k.hdr" />
        </Canvas>
    );
}

export default App;
