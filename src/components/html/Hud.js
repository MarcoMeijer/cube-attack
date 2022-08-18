import { useStore } from "../../hooks/useStore";
import "../../styles/hud.css"


export const Hud = () => {
    const { wave, health, money } = useStore();

    return <div className="hud">
        <div className="bottomLeft">
            <h3 className="wave">Wave: {wave + 1}</h3>
            <h3 className="wave">Health: {health}</h3>
        </div>
        <div className="bottomRight">
            <h3 className="wave">Money: {money}</h3>
        </div>
    </div>;
}
