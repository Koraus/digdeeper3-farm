import { getStepIndicators } from "../model/get-step-indicators";
import { ReactionCard } from "./reaction-card";
import { formatWithSuffix } from "./reactor-view";

export function StepIndicators({ reactions }: { reactions: ReactionCard[] }) {

    const reaction = getStepIndicators(reactions.map(r => r.reactionSeed));

    return (
        <p css={{ margin: "0 0 0.4em 0" }}>
            steps:&nbsp;{formatWithSuffix(reaction.steps)}
            &nbsp;
            repeatAt:&nbsp;
            {formatWithSuffix(reaction.repeatAt)}
            &nbsp;
            stepRatio:&nbsp;
            {formatWithSuffix(reaction.stepRatio)}
        </p>
    );
}