
export function movePath({ path, start, section, speed, delta }) {
    const pos = start.clone();
    while (section < path.length) {
        const dir = path[section].clone().sub(pos);
        const vel = dir.clone().normalize().multiplyScalar(delta*speed);
        if (vel.length() >= dir.length()) {
            pos.add(dir);
            section += 1;
            if (vel.length() >= 0.0001) {
                delta -= delta*dir.length()/vel.length();
            }
        } else {
            pos.add(vel);
            break;
        }
    }
    return { section, pos };
}
