import { Bloom, EffectComposer } from "@react-three/postprocessing";
import React from "react";

export const Effects = () => {
    return (
        <EffectComposer>
            <Bloom luminanceThreshold={0.2} intensity={3} mipmapBlur radius={0.5} levels={20} />
        </EffectComposer>
    )
};
