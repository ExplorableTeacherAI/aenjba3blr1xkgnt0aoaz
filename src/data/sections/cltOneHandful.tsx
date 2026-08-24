import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeInput,
    InlineClozeChoice,
    InlineLinkedHighlight,
    InlineFeedback,
} from "@/components/atoms";
import {
    getVariableInfo,
    clozePropsFromDefinition,
    choicePropsFromDefinition,
    linkedHighlightPropsFromDefinition,
} from "../variables";
import { TwoHandfulsFigure } from "./figures/TwoHandfulsFigure";

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
            <EditableParagraph id="para-one-handful-invite" blockId="one-handful-invite">
                Amara and Ben each grab five runners from that same school. Drag any of Amara&apos;s teal
                runners onto a different runner and her average shifts, while Ben&apos;s sits stubbornly
                somewhere else.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-visual" maxWidth="xl">
        <Block id="one-handful-visual" padding="sm" hasVisualization>
            <TwoHandfulsFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-reflect" maxWidth="xl">
        <Block id="one-handful-reflect" padding="sm">
            <EditableParagraph id="para-one-handful-reflect" blockId="one-handful-reflect">
                Both handfuls are honest, both were picked from the same runners, and still the two averages
                land apart, either side of{" "}
                <InlineLinkedHighlight
                    varName="duelHighlight"
                    highlightId="trueAverage"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('duelHighlight'))}
                >
                    the school&apos;s true average
                </InlineLinkedHighlight>
                . Can you make either one land on 15.2 exactly?
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
                    hint="Look at how far apart two honest handfuls from the same school already are"
                    reviewBlockId="one-handful-reflect"
                    reviewLabel="Review this idea"
                    visualizationHint={{
                        blockId: "one-handful-visual",
                        hintKey: "one-handful-next-hint",
                        label: "Discover it yourself",
                        resetVars: { duelSwaps: 0, duelRedraws: 0 },
                        steps: [
                            {
                                gesture: "drag",
                                label: "Drag one of Amara's runners onto another runner and watch her average move",
                                position: { x: "45%", y: "24%" },
                                dragPath: { type: "line", startOffset: { x: -25, y: -12 }, endOffset: { x: 25, y: 12 } },
                                completionVar: "duelSwaps",
                                completionValue: 2,
                                completionTolerance: 1,
                            },
                            {
                                gesture: "click",
                                label: "Now give them both new handfuls and compare the two averages again",
                                position: { x: "50%", y: "92%" },
                                completionVar: "duelRedraws",
                                completionValue: 2,
                                completionTolerance: 1,
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
