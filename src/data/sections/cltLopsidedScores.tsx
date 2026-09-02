import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout, SplitLayout } from "@/components/layouts";
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
} from "../variables";
import { ACCENT, ACCENT_BG, INK_BG, INK_STRONG, PARTNER, PARTNER_BG } from "./figures/figureStyle";
import { AuditionScoresFigure, AuditionAveragesFigure } from "./figures/AuditionLinkedFigures";

export const cltLopsidedScoresBlocks: ReactElement[] = [
    <StackLayout key="layout-lopsided-heading" maxWidth="xl">
        <Block id="lopsided-heading" padding="md">
            <EditableH2 id="h2-lopsided-heading" blockId="lopsided-heading">
                Lopsided Scores, Bell-Shaped Averages
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lopsided-setup" maxWidth="xl">
        <Block id="lopsided-setup" padding="sm">
            <EditableParagraph id="para-lopsided-setup" blockId="lopsided-setup">
                Auditions for the school show are scored out of ten. Most dancers score low, a few score
                very high, so the scores bunch hard against the left and trail away to the right. Nothing
                bell-shaped about that at all.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lopsided-invite" maxWidth="xl">
        <Block id="lopsided-invite" padding="sm">
            <EditableParagraph id="para-lopsided-invite" blockId="lopsided-invite">
                Now average the scores of five dancers picked at random, over and over. Drag any bar on the
                left to pile dancers onto different marks, and watch the pile of averages on the right
                answer back.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <SplitLayout key="layout-lopsided-linked-views" ratio="1:1" gap="lg" align="start">
        <Block id="lopsided-visual" padding="sm" hasVisualization>
            <AuditionScoresFigure />
        </Block>
        <Block id="lopsided-averages-view" padding="sm" hasVisualization>
            <AuditionAveragesFigure />
        </Block>
    </SplitLayout>,

    <StackLayout key="layout-lopsided-reflect" maxWidth="xl">
        <Block id="lopsided-reflect" padding="sm">
            <EditableParagraph id="para-lopsided-reflect" blockId="lopsided-reflect">
                However lopsided you make{" "}
                <InlineLinkedHighlight
                    varName="auditionHighlight"
                    highlightId="scores"
                    color={ACCENT}
                    bgColor={ACCENT_BG}
                >
                    the scores
                </InlineLinkedHighlight>
                ,{" "}
                <InlineLinkedHighlight
                    varName="auditionHighlight"
                    highlightId="averages"
                    color={PARTNER}
                    bgColor={PARTNER_BG}
                >
                    the pile of averages
                </InlineLinkedHighlight>
                {" "}keeps coming back to a bell, centred on{" "}
                <InlineLinkedHighlight
                    varName="auditionHighlight"
                    highlightId="meanLine"
                    color={INK_STRONG}
                    bgColor={INK_BG}
                >
                    the average score
                </InlineLinkedHighlight>
                . The shape of the data and the shape of its averages are two different things.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lopsided-question-shape" maxWidth="xl">
        <Block id="lopsided-question-shape" padding="md">
            <EditableParagraph id="para-lopsided-question-shape" blockId="lopsided-question-shape">
                A gymnastics club scores its members in the same badly lopsided way. The averages of random
                groups of five members will be{" "}
                <InlineFeedback
                    varName="answer_lopsided_shape"
                    correctValue="still bell-shaped"
                    position="terminal"
                    successMessage="— yes, averaging smooths the lopsidedness away whatever the original scores look like"
                    failureMessage="— have another look."
                    hint="A group of five rarely picks five low scorers or five high ones, so most groups land in between"
                    visualizationHint={{
                        blockId: "lopsided-visual",
                        hintKey: "lopsided-shape-hint",
                        label: "Discover it yourself",
                        resetVars: { auditionEdits: 0 },
                        steps: [
                            {
                                gesture: "drag-vertical",
                                label: "Drag the bars until nearly every dancer scores 8 or more",
                                position: { x: "30%", y: "45%" },
                                dragPath: { type: "line", startOffset: { x: 0, y: -22 }, endOffset: { x: 0, y: 22 } },
                                completionVar: "auditionLowShare",
                                completionValue: 10,
                                completionTolerance: 10,
                            },
                            {
                                gesture: "drag-vertical",
                                label: "Now pile them back onto the low scores and watch the averages stay bell-shaped",
                                position: { x: "30%", y: "45%" },
                                dragPath: { type: "line", startOffset: { x: 0, y: -22 }, endOffset: { x: 0, y: 22 } },
                                completionVar: "auditionLowShare",
                                completionValue: 85,
                                completionTolerance: 15,
                            },
                        ],
                    }}
                >
                    <InlineClozeChoice
                        varName="answer_lopsided_shape"
                        correctAnswer="still bell-shaped"
                        options={["still bell-shaped", "lopsided in the same way", "flat and shapeless"]}
                        {...choicePropsFromDefinition(getVariableInfo('answer_lopsided_shape'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lopsided-question-group-mean" maxWidth="xl">
        <Block id="lopsided-question-group-mean" padding="md">
            <EditableParagraph id="para-lopsided-question-group-mean" blockId="lopsided-question-group-mean">
                One group of five dancers scores 4, 9, 6, 3 and 8. Their group average is{" "}
                <InlineFeedback
                    varName="answer_lopsided_group_mean"
                    correctValue={["6", "6.0"]}
                    position="terminal"
                    successMessage="— right, 30 marks shared between five dancers, and notice it sits between the extremes"
                    failureMessage="— not quite."
                    hint="Add the five scores, then share the total between the five dancers"
                >
                    <InlineClozeInput
                        varName="answer_lopsided_group_mean"
                        correctAnswer={["6", "6.0"]}
                        {...clozePropsFromDefinition(getVariableInfo('answer_lopsided_group_mean'))}
                    />
                </InlineFeedback>
                {" "}out of 10.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
