import './styles/index.css';
import React from 'react';
import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EnemyPool } from './components/Enemy';
import { TowerPool } from './components/Tower';
import { ProjectilePool } from './components/Projectile';
import { Effects } from './components/Effects';
import { Floor } from './components/Floor';
import { Wave } from './components/Wave';
import { Hud } from './components/html/Hud';

const App = () => {
    return (
        <>
            <Canvas mode="concurrent" camera={{ position: [8.5, 10, 20]}}>
                <Floor />
                <fog color="#b8bfbe" attach="fog" near={100} far={200} />
                <TowerPool />
                <EnemyPool />
                <Wave />
                <ProjectilePool />
                <OrbitControls enablePan={false} target-x={8.5} target-z={8.5}/>
                <Stars radius={100} depth={50} count={5000} factor={8} saturation={1} fade speed={2} />
                <Effects />
                <ambientLight intensity={1}/>
                {/* <Environment files="/je_gray_park_2k.hdr" /> */}
            </Canvas>
            <Hud />
        </>
    );
}

export default App;
