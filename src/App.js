import './styles/index.css';
import React, { useState } from 'react';
import { Environment, OrbitControls, Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { EnemyPool } from './components/Enemy';
import { TowerPool } from './components/Tower';
import { ProjectilePool } from './components/Projectile';
import { Effects } from './components/Effects';
import { Floor } from './components/Floor';
import { Wave } from './components/Wave';
import { Hud } from './components/html/Hud';
import { initialState, StoreContext } from './hooks/useStore';
import { Light } from './components/Light';

const App = () => {
    const [state, setState] = useState({...initialState});
    const [dummy, setDummy] = useState(0);

    const setStore = (f) => {
        const props = f(state);
        let changed = false;
        for (const key in props) {
            if (state[key] !== props[key]) {
                state[key] = props[key];
                changed = true;
            }
        }
        if (changed) {
            setDummy(dummy + 1);
            setState(state);
        }
    }
    state.setStore = setStore;

    return (
        <StoreContext.Provider value={{current: state}}>
            <Canvas camera={{ position: [8.5, 10, 20]}} shadows>
                <StoreContext.Provider value={{current: state}}>
                    <Floor />
                    <fog color="#b8bfbe" attach="fog" near={100} far={200} />
                    <TowerPool />
                    <EnemyPool />
                    <Wave />
                    <ProjectilePool />
                    <OrbitControls enablePan={false} target-x={8.5} target-z={8.5}/>
                    <Stars radius={100} depth={50} count={5000} factor={8} saturation={1} fade speed={2} />
                    <Effects />
                    <Light />
                    <Environment background={true} files="/Milkyway_small.hdr" />
                </StoreContext.Provider>
            </Canvas>
            <Hud />
        </StoreContext.Provider>
    );
}

export default App;
