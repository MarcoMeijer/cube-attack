import { useFrame } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { Color, Object3D, Vector3 } from 'three';
import { useStore } from '../hooks/useStore';
import { movePath } from '../math/enemy';

const MAX_ENEMIES = 10000;

export class Enemy {
    constructor(parent) {
        if (parent === undefined) {
            this.pos = new Vector3();
            this.section = 0;
        } else {
            this.pos = parent.pos.clone();
            this.section = parent.section;
        }
        this.scale = new Vector3(1, 1, 1);
        this.speed = 3;
        this.health = 1;
        this.maxHealth = 1;
        this.futureHealth = 1;
        this.money = 1;
        this.color = new Color(0.4, 0.4, 2.3);
        this.children = [];
        this.traveled = 0;
    }

    damage(amount) {
        this.futureHealth -= amount;
        this.health -= amount;
        this.futureHealth = Math.max(this.futureHealth, 0);
        this.health = Math.max(this.health, 0);
    }

    futureDamage(amount) {
        this.futureHealth -= amount;
        this.futureHealth = Math.max(this.futureHealth, 0);
    }

    promisedDamage(amount) {
        this.health -= amount;
        this.health = Math.max(this.health, 0);
    }
}

export const EnemyOne = (parent) => {
    const enemy = new Enemy(parent);
    enemy.scale = new Vector3(0.5, 0.5, 0.5);
    return enemy;
}
export const EnemyTwo = (parent) => {
    const enemy = new Enemy(parent);
    enemy.scale = new Vector3(0.65, 0.65, 0.65);
    enemy.color = new Color(0.3, 2, 0.3);
    enemy.children.push(EnemyOne);
    enemy.speed = 2;
    return enemy;
}
export const EnemyThree = (parent) => {
    const enemy = new Enemy(parent);
    enemy.scale = new Vector3(0.8, 0.8, 0.8);
    enemy.color = new Color(2, 0.3, 0.3);
    enemy.children.push(EnemyTwo);
    enemy.speed = 5;
    return enemy;
}

export function EnemyPool() {
    const mesh = useRef();
    let { health, path, enemies, setStore } = useStore();

    const colorArray = useMemo(() => Float32Array.from(new Array(MAX_ENEMIES*3).fill().flatMap((_, i) => new Color(0.3,2,0.4).toArray())), [])

    const dummy = useMemo(() => new Object3D(), []);

    useFrame((state, delta) => {
        const newEnemies = enemies.filter((enemy, i) => {
            const { pos, scale, section, speed } = enemy;

            if (section === path.length) {
                health--;
                return false;
            }
            
            // move the enemy along the path
            const { section: newSection, pos: newPos } = movePath({
                path,
                section,
                speed,
                delta,
                start: pos
            })
            pos.copy(newPos);
            enemy.section = newSection;
            enemy.traveled += speed*delta;

            // apply changes to dummy and to the instanced matrix
            dummy.position.copy(pos);
            dummy.scale.copy(scale);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
            enemy.color.toArray(colorArray, i*3);
            return true;
        });
        newEnemies.sort((a, b) => a.traveled < b.traveled);

        enemies.length = 0;
        enemies.push(...newEnemies);

        if (health <= 0) {
            health = 0;
            setStore(() => ({gameOver: true}));
        }
        setStore(() => ({health}));

        mesh.current.count = enemies.length;
        mesh.current.instanceMatrix.needsUpdate = true;
        mesh.current.geometry.attributes.color.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, MAX_ENEMIES]} position-y={0.3}>
            <boxBufferGeometry args={[0.3, 0.3, 0.3]}>
                <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
            </boxBufferGeometry>
            <meshBasicMaterial toneMapped={false} vertexColors />
        </instancedMesh>
    );
}
