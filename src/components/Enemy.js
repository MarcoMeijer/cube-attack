import { useFrame } from '@react-three/fiber';
import React, { useEffect, useMemo, useRef } from 'react';
import { Object3D, Vector3 } from 'three';
import { useStore } from '../hooks/useStore';
import { movePath } from '../math/enemy';

const MAX_ENEMIES = 1000;

export class Enemy {
    constructor() {
        this.pos = new Vector3();
        this.section = 0;
        this.speed = 3;
        this.health = 10;
        this.maxHealth = 10;
        this.futureHealth = 10;
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

export function EnemyPool() {
    const mesh = useRef();
    const { path, enemies } = useStore();

    const dummy = useMemo(() => new Object3D(), []);

    // initial enemies
    useEffect(() => {
        for (let i=0; i<10; i++) {
            const enemy = new Enemy();
            enemy.speed -= 0.1*i;
            enemy.pos = path[0].clone();
            enemies.push(enemy);
        }
    }, [enemies]);

    useFrame((state, delta) => {
        enemies.forEach((enemy, i) => {
            const { pos, section, speed } = enemy;

            if (section === path.length)
                return;
            
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

            // apply changes to dummy and to the instanced matrix
            dummy.position.copy(pos);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);
        });

        mesh.current.count = enemies.length;
        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, MAX_ENEMIES]} position-y={0.3}>
            <sphereGeometry args={[0.3]}/>
            <meshStandardMaterial color={0xff0000}/>
        </instancedMesh>
    );
}
