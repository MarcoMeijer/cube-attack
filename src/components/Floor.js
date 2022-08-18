import { useTexture } from "@react-three/drei";
import { useStore } from "../hooks/useStore";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Object3D, Vector3 } from "three";

const MAP_WIDTH = 17;
const MAP_HEIGHT = 17;

const Tiles = ({ colorMap, grid, char, ...props }) => {
    const mesh = useRef();

    const dummy = useMemo(() => new Object3D(), []);
    useEffect(() => {
        if (mesh.current) {
            let mi = 0;
            for (let i=0; i<MAP_WIDTH; i++) {
                for (let j=0; j<MAP_HEIGHT; j++) {
                    if (grid[i][j] === char) {
                        dummy.position.copy(new Vector3(i, -j, 0));
                        dummy.updateMatrix();
                        mesh.current.setMatrixAt(mi, dummy.matrix);
                        mi += 1;
                    }
                }
            }
            mesh.current.instanceMatrix.needsUpdate = true;
        }
    }, [mesh, grid, char, dummy]);

    return <instancedMesh rotation-x={Math.PI * -0.5} ref={mesh} args={[null, null, MAP_WIDTH*MAP_HEIGHT]} {...props} >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
            map={colorMap}
            map-wrapS={THREE.RepeatWrapping}
            map-wrapT={THREE.RepeatWrapping}
            map-repeat={[1, 1]}
        />
    </instancedMesh>;
}

export const Floor = () => {
    const [floor, path] = useTexture([
        '/floor.png',
        '/path.png',
    ]);

    const grid = [
        "        x        ",
        "   xxxxxx        ",
        "   x             ",
        "   xxxxxxxxxxx   ",
        "             x   ",
        "             x   ",
        "      xxxxxxxx   ",
        "      x          ",
        "xxx   x          ",
        "  x   x    xxxx  ",
        "  x   x    x  x  ",
        "  x   x    x  x  ",
        "  xxxxxxxxxxxxx  ",
        "      x    x     ",
        "      x    x     ",
        "      xxxxxx     ",
        "                 ",
    ];

    const { towers } = useStore();

    return (
        <>
            <Tiles
                colorMap={floor}
                grid={grid}
                char={" "}
                onContextMenu={e => {
                    const pos = e.intersections[0].point;
                    pos.x = Math.round(pos.x);
                    pos.z = Math.round(pos.z);
                    towers.push({
                        pos,
                        fireRate: 0.4,
                        recharge: 0,
                    });
                }}
            />
            <Tiles colorMap={path} grid={grid} char={"x"}/>
        </>
    )
}