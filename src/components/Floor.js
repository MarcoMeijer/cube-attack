import { useTexture } from "@react-three/drei";
import { useStore } from "../hooks/useStore";
import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Object3D, Vector3 } from "three";

const MAP_WIDTH = 17;
const MAP_HEIGHT = 17;

const Tiles = ({ colorMap, normalMap, metalMap, grid, char, ...props }) => {
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

    return <instancedMesh
        rotation-x={Math.PI * -0.5}
        ref={mesh}
        args={[null, null, MAP_WIDTH*MAP_HEIGHT]}
        {...props}
    >
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
            map={colorMap}
            map-wrapS={THREE.RepeatWrapping}
            map-wrapT={THREE.RepeatWrapping}
            map-repeat={[1, 1]}
            roughness={metalMap ? 0.08 : 1}
            metalness={metalMap ? 1 : 0}
            metalnessMap={metalMap}
            normalMap={normalMap}
            normalMapScale={[1, 1]}
        />
    </instancedMesh>;
}

export const Floor = () => {
    const [floor, floorNormal, floorMetal, path] = useTexture([
        '/floor.png',
        '/floor-norm.png',
        '/floor-metal.png',
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

    const { towers, setStore, selectedTower } = useStore();

    return (
        <>
            <Tiles
                colorMap={floor}
                normalMap={floorNormal}
                metalMap={floorMetal}
                grid={grid}
                char={" "}
                onContextMenu={e => {
                    const pos = e.intersections[0].point;
                    pos.x = Math.round(pos.x);
                    pos.z = Math.round(pos.z);

                    let empty = true;
                    for (const tower of towers) {
                        if (tower.pos.x === pos.x && tower.pos.z === pos.z) {
                            empty = false;
                        }
                    }
                    
                    if (empty) {
                        setStore(({ money }) => {
                            if (money >= 100) {
                                towers.push(selectedTower(pos));
                                return {money: money - 100};
                            }
                            return {};
                        });
                    }
                }}
            />
            <Tiles colorMap={path} grid={grid} char={"x"}/>
        </>
    )
}