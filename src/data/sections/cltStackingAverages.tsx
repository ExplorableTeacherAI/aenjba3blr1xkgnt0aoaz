import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeChoice,
    InlineLinkedHighlight,
    InlineScrubbleNumber,
    InlineSpotColor,
    InlineTooltip,
    InlineTrigger,
    InlineFeedback,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import {
    getVariableInfo,
    choicePropsFromDefinition,
    linkedHighlightPropsFromDefinition,
    numberPropsFromDefinition,
    scrubVarsFromDefinitions,
    spotColorPropsFromDefinition,
} from "../variables";
import { AveragePourFigure } from "./figures/AveragePourFigure";

const STACK_COLORS = {
    average: '#8E90F5',
    columnLeft: '#8E90F5',
    columnRight: '#62CCF9',
    total: '#AC8BF9',
    trueMean: '#475569',
};

export const cltStackingAveragesBlocks: ReactElement[] = [
    <StackLayout key="layout-stacking-heading" maxWidth="xl">
        <Block id="stacking-heading" padding="md">
            <EditableH2 id="h2-stacking-heading" blockId="stacking-heading">
                Stacking Up the Averages
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-setup" maxWidth="xl">
        <Block id="stacking-setup" padding="sm">
            <EditableParagraph id="para-stacking-setup" blockId="stacking-setup">
                One handful tells you very little. A hundred handfuls tell you a lot, because now the{" "}
                <InlineSpotColor
                    varName="averageColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('averageColor'))}
                >
                    answers
                </InlineSpotColor>
                {" "}can be sorted into{" "}
                <InlineTooltip
                    id="tooltip-stacking-columns"
                    tooltip="Each column covers a quarter-second band of times, and every block in it is one handful whose average landed in that band."
                >
                    columns
                </InlineTooltip>
                , one column for every quarter of a second.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-invite" maxWidth="xl">
        <Block id="stacking-invite" padding="sm">
            <EditableParagraph id="para-stacking-invite" blockId="stacking-invite">
                A column ten blocks tall means ten handfuls averaged inside that quarter-second. Drag the
                teal sampler to the right, or hold it at{" "}
                <InlineScrubbleNumber
                    varName="stackTilt"
                    {...numberPropsFromDefinition(getVariableInfo('stackTilt'))}
                    formatValue={(v) => `${v}°`}
                />
                {" "}for a steady trickle, and see which columns climb. You can also{" "}
                <InlineTrigger varName="stackTilt" value={70} icon="zap">
                    tip it right over
                </InlineTrigger>
                {" "}for a stream, or{" "}
                <InlineTrigger varName="stackTilt" value={0} icon="refresh">
                    stand it upright
                </InlineTrigger>
                {" "}to stop the pour.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-visual" maxWidth="xl">
        <Block id="stacking-visual" padding="sm" hasVisualization>
            <AveragePourFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-pile-formula" maxWidth="xl">
        <Block id="stacking-pile-formula" padding="lg">
            <FormulaBlock
                latex="\clr{total}{\text{blocks in the whole pile}} = \val{stackPoured} \qquad \text{each block} = \text{one } \clr{average}{\text{handful average}}"
                colorMap={STACK_COLORS}
                variables={scrubVarsFromDefinitions(['stackPoured'])}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-reflect" maxWidth="xl">
        <Block id="stacking-reflect" padding="sm">
            <EditableParagraph id="para-stacking-reflect" blockId="stacking-reflect">
                Averages near{" "}
                <InlineLinkedHighlight
                    varName="stackHighlight"
                    highlightId="trueAverage"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('stackHighlight'))}
                >
                    the school&apos;s true average
                </InlineLinkedHighlight>
                {" "}come up again and again, while averages far out happen once or twice. That is why{" "}
                <InlineLinkedHighlight
                    varName="stackHighlight"
                    highlightId="middle"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('stackHighlight'))}
                >
                    the middle columns
                </InlineLinkedHighlight>
                {" "}climb fastest and the edges stay short.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-question-columns" maxWidth="xl">
        <Block id="stacking-question-columns" padding="sm">
            <EditableParagraph id="para-stacking-question-columns" blockId="stacking-question-columns">
                Suppose one column stands 12 blocks tall and the column beside it stands 9. Work out how
                many handfuls landed across those two quarter-seconds together.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-columns-formula" maxWidth="xl">
        <Block id="stacking-columns-formula" padding="lg">
            <FormulaBlock
                latex="\clr{columnLeft}{12} + \clr{columnRight}{9} = \cloze{answer_stacking_two_columns}\ \text{handfuls}"
                colorMap={STACK_COLORS}
                clozeInputs={{
                    answer_stacking_two_columns: {
                        correctAnswer: "21",
                        placeholder: "???",
                        color: '#AC8BF9',
                        bgColor: 'rgba(172, 139, 249, 0.15)',
                    },
                }}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-question-tallest" maxWidth="xl">
        <Block id="stacking-question-tallest" padding="md">
            <EditableParagraph id="para-stacking-question-tallest" blockId="stacking-question-tallest">
                Once a few hundred handfuls have poured in, the tallest columns will sit{" "}
                <InlineFeedback
                    varName="answer_stacking_tallest"
                    correctValue="near the middle, around 15.2 seconds"
                    position="terminal"
                    successMessage="— yes, ordinary averages happen far more often than extreme ones"
                    failureMessage="— have another look."
                    hint="Think about how often five runners would all happen to be fast"
                    visualizationHint={{
                        blockId: "stacking-visual",
                        hintKey: "stacking-tallest-hint",
                        label: "Discover it yourself",
                        resetVars: { stackPoured: 0, stackTilt: 0 },
                        steps: [
                            {
                                gesture: "drag-horizontal",
                                label: "Drag the sampler right and hold it there to pour a stream of handfuls",
                                position: { x: "50%", y: "16%" },
                                dragPath: { type: "line", startOffset: { x: -10, y: 0 }, endOffset: { x: 40, y: 0 } },
                                completionVar: "stackPoured",
                                completionValue: 40,
                                completionTolerance: 35,
                            },
                            {
                                gesture: "drag-horizontal",
                                label: "Keep pouring until the pile has a clear shape, then read across it",
                                position: { x: "50%", y: "16%" },
                                dragPath: { type: "line", startOffset: { x: -10, y: 0 }, endOffset: { x: 40, y: 0 } },
                                completionVar: "stackPoured",
                                completionValue: 140,
                                completionTolerance: 60,
                            },
                        ],
                    }}
                >
                    <InlineClozeChoice
                        varName="answer_stacking_tallest"
                        correctAnswer="near the middle, around 15.2 seconds"
                        options={[
                            "near the middle, around 15.2 seconds",
                            "at the far left, with the fastest times",
                            "spread evenly across every column",
                        ]}
                        {...choicePropsFromDefinition(getVariableInfo('answer_stacking_tallest'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
