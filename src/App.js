import './styles.css';
import React, { useEffect, useRef } from 'react';
import { Environment, OrbitControls, useGLTF } from '@react-three/drei';
import { Controls, useControl } from 'react-three-gui';
import { useFrame } from '@react-three/fiber';

const SpinningCube = () => {
    const box = useRef();

    const roughness = useControl('Roughness', { type: 'number', min: 0, max: 1 });
    const metalness = useControl('Metalness', { type: 'number', min: 0, max: 1 });
    const speed = useControl('Speed', { type: 'number', min: 0, max: 10 });

    useFrame(({ clock }) => {
        box.current.rotation.x += speed * 0.01;
        box.current.rotation.y += speed * 0.01;
    });

    const { scene } = useGLTF('model.glb')

    useEffect(() => {
        scene.traverse((object) => {
            if (object.isMesh) {
                object.material.roughness = roughness;
                object.material.metalness = metalness;
            }
        })
    }, [scene, roughness, metalness]);

    return <primitive ref={box} object={scene} />
}

const App = () => {
    return (
        <Controls.Provider>
            <Controls.Canvas>
                <SpinningCube />
                <OrbitControls />
                <Environment background={true} files="/neon_photostudio_2k.hdr" />
            </Controls.Canvas>
            <Controls />
        </Controls.Provider>
    );
}

export default App;
