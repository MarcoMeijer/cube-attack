import { useStore } from "../../hooks/useStore";
import "../../styles/hud.css"


export const Hud = () => {
    const { wave } = useStore();

    return <div className="hud">
        <div className="bottomLeft">
            <h3 className="wave">Wave: {wave + 1}</h3>
            <h3 className="wave">Health: {100}</h3>
        </div>
        <div className="bottomRight">
            <h3 className="wave">Money: {432}</h3>
        </div>
    </div>;
}
