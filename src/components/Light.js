import { useHelper } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { DirectionalLight, DirectionalLightHelper, SpotLightHelper } from "three";

export const Light = () => {
    const light = useRef();
    useHelper(light, DirectionalLightHelper, 'cyan');
    const { scene } = useThree();

    useEffect(() => {
        scene.add(light.current.target);
        light.current.target.position.x = 8;
        light.current.target.position.z = 8;
    }, [light]);

    return <>
        <ambientLight intensity={0.8}/>
        <directionalLight
            ref={light}
            position={[10,12,12]}
            intensity={1.2}
            castShadow
            shadow-camera-near={0.1}
            shadow-camera-far={30}
            shadow-camera-left={-20}
            shadow-camera-right={20}
            shadow-camera-top={20}
            shadow-camera-bottom={-20}
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
        />
    </>;
}