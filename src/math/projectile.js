import { movePath } from "./enemy";

export function calculateProjectileVelocity({ path, source, target, speed }) {
    const targetPos = target.pos.clone();
    const curVel = targetPos.clone().sub(source).normalize().multiplyScalar(speed);
    const precision = 10;

    for (let i=0; i<precision; i++) {
        const delta = -source.y/curVel.y;
        const { pos: enemyPos } = movePath({
            path,
            delta,
            start: target.pos,
            section: target.section,
            speed: target.speed,
        });

        targetPos.copy(enemyPos.clone()
            .multiplyScalar(0.5)
            .add(targetPos.clone().multiplyScalar(0.5))
        );

        curVel.copy(
            enemyPos.clone().sub(source)
                .normalize()
                .multiplyScalar(speed)
        );
    }

    return curVel;
}
