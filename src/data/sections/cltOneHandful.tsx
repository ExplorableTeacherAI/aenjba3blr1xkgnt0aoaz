import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineScrubbleNumber,
    InlineClozeInput,
    InlineClozeChoice,
    InlineLinkedHighlight,
    InlineFeedback,
} from "@/components/atoms";
import {
    getVariableInfo,
    numberPropsFromDefinition,
    clozePropsFromDefinition,
    choicePropsFromDefinition,
    linkedHighlightPropsFromDefinition,
} from "../variables";
import { SprintSamplePredictionFigure } from "./figures/SprintSamplePredictionFigure";

export const cltOneHandfulBlocks: ReactElement[] = [
    <StackLayout key="layout-one-handful-heading" maxWidth="xl">
        <Block id="one-handful-heading" padding="md">
            <EditableH2 id="h2-one-handful-heading" blockId="one-handful-heading">
                One Handful of Runners
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-setup" maxWidth="xl">
        <Block id="one-handful-setup" padding="sm">
            <EditableParagraph id="para-one-handful-setup" blockId="one-handful-setup">
                Suppose the true average across the whole school is 15.2 seconds, though nobody knows that
                yet. Take five runners: 14.1, 16.8, 15.0, 13.9 and 17.2 seconds add to 77.0, so their
                average is 15.4 seconds. Close, but not equal.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-invite" maxWidth="xl">
        <Block id="one-handful-invite" padding="sm">
            <EditableParagraph id="para-one-handful-invite" blockId="one-handful-invite">Would the next five runners do any better? A guess of <InlineScrubbleNumber varName={"sprintPrediction"} defaultValue={20} min={10} max={30} step={105} color={"#E53935"} id={"scrubble-1787569355758-j60ni"} /> seconds is as good a start as any, so drag the teal marker to wherever you think their average will land, then draw the handful.</EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-visual" maxWidth="xl">
        <Block id="one-handful-visual" padding="sm" hasVisualization>
            <SprintSamplePredictionFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-reflect" maxWidth="xl">
        <Block id="one-handful-reflect" padding="sm">
            <EditableParagraph id="para-one-handful-reflect" blockId="one-handful-reflect">
                Each handful leaves its average behind as a faint mark, and those marks scatter either side
                of{" "}
                <InlineLinkedHighlight
                    varName="sprintHighlight"
                    highlightId="trueAverage"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('sprintHighlight'))}
                >
                    the school&apos;s true average
                </InlineLinkedHighlight>
                {" "}rather than landing on it. Does any handful hit 15.2 exactly?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-question-next" maxWidth="xl">
        <Block id="one-handful-question-next" padding="md">
            <EditableParagraph id="para-one-handful-question-next" blockId="one-handful-question-next">
                A brand new handful of five runners is about to be drawn. Its average will be{" "}
                <InlineFeedback
                    varName="answer_one_handful_next"
                    correctValue="close to 15.2 but usually not exactly 15.2"
                    position="terminal"
                    successMessage="— yes, a handful lands near the true average and only rarely right on it"
                    failureMessage="— not quite."
                    hint="Look at where the faint marks from the earlier handfuls sit"
                    reviewBlockId="one-handful-reflect"
                    reviewLabel="Review this idea"
                    visualizationHint={{
                        blockId: "one-handful-visual",
                        hintKey: "one-handful-next-hint",
                        label: "Discover it yourself",
                        resetVars: { sprintDrawCount: 0, sprintLastMean: 0, sprintPrediction: 16 },
                        steps: [
                            {
                                gesture: "drag-horizontal",
                                label: "Drag the teal marker onto 15.2, the school's own average",
                                position: { x: "57%", y: "17%" },
                                dragPath: { type: "line", startOffset: { x: -30, y: 0 }, endOffset: { x: 30, y: 0 } },
                                completionVar: "sprintPrediction",
                                completionValue: 15.2,
                                completionTolerance: 0.15,
                            },
                            {
                                gesture: "click",
                                label: "Now draw a few handfuls and see how many land right on the marker",
                                position: { x: "44%", y: "90%" },
                                completionVar: "sprintDrawCount",
                                completionValue: 3,
                                completionTolerance: 2,
                            },
                        ],
                    }}
                >
                    <InlineClozeChoice
                        varName="answer_one_handful_next"
                        correctAnswer="close to 15.2 but usually not exactly 15.2"
                        options={[
                            "exactly 15.2",
                            "close to 15.2 but usually not exactly 15.2",
                            "nowhere near 15.2",
                        ]}
                        {...choicePropsFromDefinition(getVariableInfo('answer_one_handful_next'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-question-mean" maxWidth="xl">
        <Block id="one-handful-question-mean" padding="md">
            <EditableParagraph id="para-one-handful-question-mean" blockId="one-handful-question-mean">
                A different handful, this time of four sprinters, clocks 13.6, 15.4, 16.2 and 14.8 seconds,
                so the average of that handful is{" "}
                <InlineFeedback
                    varName="answer_one_handful_mean"
                    correctValue={["15", "15.0"]}
                    position="terminal"
                    successMessage="— exactly, 60.0 seconds shared between four runners"
                    failureMessage="— almost."
                    hint="Add the four times first, then split the total four ways"
                >
                    <InlineClozeInput
                        varName="answer_one_handful_mean"
                        correctAnswer={["15", "15.0"]}
                        {...clozePropsFromDefinition(getVariableInfo('answer_one_handful_mean'))}
                    />
                </InlineFeedback>
                {" "}seconds.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
