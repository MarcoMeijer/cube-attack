import { movePath } from "./enemy";

export function calculateProjectileVelocity({ path, source, target, speed, radius }) {
    let lb=0, ub=radius/speed;
    const precision = 0.01;
    while (ub - lb >= precision) {
        const mid = (lb+ub)/2;
        const { pos: enemyPos } = movePath({
            path,
            delta: mid,
            start: target.pos,
            section: target.section,
            speed: target.speed,
        });
        const dist = enemyPos.sub(source).length();

        if (dist <= mid*speed) {
            ub = mid;
        } else {
            lb = mid;
        }
    }

    const { pos: enemyPos } = movePath({
        path,
        delta: ub,
        start: target.pos,
        section: target.section,
        speed: target.speed,
    });

    const dist = enemyPos.clone().sub(source).length();
    if (dist <= ub*speed) {
        return enemyPos.sub(source).normalize().multiplyScalar(speed);
    } else {
        return null;
    }
}
