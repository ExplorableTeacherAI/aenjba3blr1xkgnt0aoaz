import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineClozeChoice,
    InlineLinkedHighlight,
    InlineSpotColor,
    InlineTooltip,
    InlineFeedback,
} from "@/components/atoms";
import { FormulaBlock } from "@/components/molecules";
import {
    getVariableInfo,
    choicePropsFromDefinition,
    spotColorPropsFromDefinition,
} from "../variables";
import { INK_BG, INK_STRONG } from "./figures/figureStyle";
import { TwoHandfulsFigure } from "./figures/TwoHandfulsFigure";

const HANDFUL_COLORS = {
    average: '#8E90F5',
    total: '#AC8BF9',
    count: '#62D0AD',
    trueMean: '#475569',
};

/**
 * The worked example, laid out one step per line and aligned on the equals
 * sign: the five times, then the total shared out, then the truth it is being
 * compared with.
 */
const WORKED_MEAN_LATEX = [
    "\\begin{aligned}",
    "\\clr{average}{\\text{handful average}} &= \\frac{\\clr{total}{14.1 + 16.8 + 15.0 + 13.9 + 17.2}}{\\clr{count}{5}} \\\\[8pt]",
    "&= \\frac{\\clr{total}{77.0}}{\\clr{count}{5}} = \\clr{average}{15.4}\\ \\text{s} \\\\[12pt]",
    "\\clr{trueMean}{\\text{true average}} &= \\clr{trueMean}{15.2}\\ \\text{s}",
    "\\end{aligned}",
].join(" ");

export const cltOneHandfulBlocks: ReactElement[] = [
    <StackLayout key="layout-one-handful-heading" maxWidth="xl">
        <Block id="one-handful-heading" padding="md">
            <EditableH2 id="h2-one-handful-heading" blockId="one-handful-heading">
                Random Samples and the Sample Mean
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-setup" maxWidth="xl">
        <Block id="one-handful-setup" padding="sm">
            <EditableParagraph id="para-one-handful-setup" blockId="one-handful-setup">
                Suppose the{" "}
                <InlineSpotColor
                    varName="trueMeanColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('trueMeanColor'))}
                >
                    true average
                </InlineSpotColor>
                {" "}across the whole school, the{" "}
                <InlineTooltip
                    id="tooltip-one-handful-population-mean"
                    tooltip="Population mean: the average you would get if you measured every single member of the group."
                >
                    population mean
                </InlineTooltip>
                , is 15.2 seconds, though nobody knows that yet. A{" "}
                <InlineTooltip
                    id="tooltip-one-handful-sample"
                    tooltip="Sample: a smaller group drawn at random from the population, standing in for the whole."
                >
                    sample
                </InlineTooltip>
                {" "}of five runners gives a{" "}
                <InlineSpotColor
                    varName="totalColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('totalColor'))}
                >
                    total
                </InlineSpotColor>
                {" "}of 77.0 seconds, and sharing that between them gives a{" "}
                <InlineTooltip
                    id="tooltip-one-handful-sample-mean"
                    tooltip="Sample mean: the average of one sample, an estimate of the population mean."
                >
                    sample mean
                </InlineTooltip>
                {" "}that lands close, but not equal.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-worked-formula" maxWidth="xl">
        <Block id="one-handful-worked-formula" padding="lg">
            <FormulaBlock
                latex={WORKED_MEAN_LATEX}
                colorMap={HANDFUL_COLORS}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-invite" maxWidth="xl">
        <Block id="one-handful-invite" padding="sm">
            <EditableParagraph id="para-one-handful-invite" blockId="one-handful-invite">
                <InlineSpotColor
                    varName="handfulColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('handfulColor'))}
                >
                    Amara
                </InlineSpotColor>
                {" "}and{" "}
                <InlineSpotColor
                    varName="averageColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('averageColor'))}
                >
                    Ben
                </InlineSpotColor>
                {" "}each grab five runners from that same school. Drag any of Amara&apos;s teal runners
                onto a different runner and her average shifts, while Ben&apos;s sits stubbornly somewhere
                else.
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
                    color={INK_STRONG}
                    bgColor={INK_BG}
                >
                    the school&apos;s true average
                </InlineLinkedHighlight>
                . That gap between a handful and the truth is called{" "}
                <InlineTooltip
                    id="tooltip-one-handful-sampling-variation"
                    tooltip="Sampling variation: two honest samples from the same group rarely give exactly the same answer."
                >
                    sampling variation
                </InlineTooltip>
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
        <Block id="one-handful-question-mean" padding="sm">
            <EditableParagraph id="para-one-handful-question-mean" blockId="one-handful-question-mean">
                A different handful, this time of four sprinters, clocks 13.6, 15.4, 16.2 and 14.8 seconds.
                Fill in what their handful average comes to.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-mean-formula" maxWidth="xl">
        <Block id="one-handful-mean-formula" padding="lg">
            <FormulaBlock
                latex="\clr{average}{\text{handful average}} = \frac{\clr{total}{13.6 + 15.4 + 16.2 + 14.8}}{\clr{count}{4}} = \cloze{answer_one_handful_mean}\ \text{s}"
                colorMap={HANDFUL_COLORS}
                clozeInputs={{
                    answer_one_handful_mean: {
                        correctAnswer: "15 | 15.0",
                        placeholder: "???",
                        color: '#8E90F5',
                        bgColor: 'rgba(142, 144, 245, 0.15)',
                    },
                }}
            />
        </Block>
    </StackLayout>,
];
