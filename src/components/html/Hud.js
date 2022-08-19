import { useEffect, useState } from "react";
import { useStore } from "../../hooks/useStore";
import "../../styles/hud.css"
import { AreaTower, Castle, FreezeTower } from "../Tower";


export const Hud = () => {
    const { wave, health, money, setStore } = useStore();
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        if (selected === 0)
            setStore(() => ({selectedTower: Castle}));
        if (selected === 1)
            setStore(() => ({selectedTower: AreaTower}));
        if (selected === 2)
            setStore(() => ({selectedTower: FreezeTower}));
    }, [selected]);

    return <div className="hud">
        <div className="top">
            <img className={selected === 0 ? "selected" : ""} src="/castle-tower.png" onClick={() => setSelected(0)}/>
            <img className={selected === 1 ? "selected" : ""} src="/area-tower.png" onClick={() => setSelected(1)}/>
            <img className={selected === 2 ? "selected" : ""} src="/freeze-tower.png" onClick={() => setSelected(2)}/>
        </div>
        <div className="bottomLeft">
            <h3 className="wave">Wave: {wave + 1}</h3>
            <h3 className="wave">Health: {health}</h3>
        </div>
        <div className="bottomRight">
            <h3 className="wave">Money: {money}</h3>
        </div>
    </div>;
}
