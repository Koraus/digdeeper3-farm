import { useRecoilValue } from "recoil";
import { getStepIndicators } from "../model/get-step-indicators";
import { reactionsRecoil } from "./reactions-recoil";
import { formatWithSuffix } from "./reactor-view";
import { useLayoutEffect, useState } from "react";
import { subscribeToReactionOutputGlobal } from "../model/reaction-output-registry";

export function StepIndicators() {

    const [renderTrigger, setRenderTrigger] = useState(0);
    useLayoutEffect(() => {
        return subscribeToReactionOutputGlobal(() => {
            setRenderTrigger(x => x + 1);
        });
    }, []);

    const reactions = useRecoilValue(reactionsRecoil);
    const reaction = getStepIndicators(reactions.map(r => r.reactionSeed));

    return (
        <p css={{ margin: "0 0 0.4em 0" }}>
            steps:&nbsp;{formatWithSuffix(reaction.steps)}&nbsp;
            repeatAt:&nbsp;{formatWithSuffix(reaction.repeatAt)}&nbsp;
            stepRatio:&nbsp;{formatWithSuffix(reaction.stepRatio)}
        </p>
    );
}