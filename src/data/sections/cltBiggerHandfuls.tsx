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
import { useVar } from "@/stores";
import {
    getVariableInfo,
    choicePropsFromDefinition,
    numberPropsFromDefinition,
    scrubVarsFromDefinitions,
    spotColorPropsFromDefinition,
} from "../variables";
import { ACCENT, ACCENT_BG, INK_BG, INK_STRONG, PARTNER, PARTNER_BG } from "./figures/figureStyle";
import { SketchThePileFigure } from "./figures/SketchThePileFigure";

const BIGGER_COLORS = {
    spread: '#8E90F5',
    scatter: '#94A3B8',
    extra: '#F4A89A',
    count: '#62D0AD',
};

/** Live width of the pile: the runners' scatter shared out over the handful size. */
function PileWidthFormula() {
    const size = useVar<number>("sketchSampleSize", 5);
    const width = (1.0 / Math.sqrt(Math.max(size, 1))).toFixed(2);
    return (
        <FormulaBlock
            latex={`\\clr{spread}{\\text{standard error}} \\approx \\frac{\\clr{scatter}{1.0\\ \\text{s}}}{\\sqrt{\\scrub{sketchSampleSize}}} = \\clr{spread}{${width}}\\ \\text{s}`}
            colorMap={BIGGER_COLORS}
            variables={scrubVarsFromDefinitions(['sketchSampleSize'])}
        />
    );
}

export const cltBiggerHandfulsBlocks: ReactElement[] = [
    <StackLayout key="layout-bigger-handfuls-heading" maxWidth="xl">
        <Block id="bigger-handfuls-heading" padding="md">
            <EditableH2 id="h2-bigger-handfuls-heading" blockId="bigger-handfuls-heading">
                Sample Size and the Standard Error
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-setup" maxWidth="xl">
        <Block id="bigger-handfuls-setup" padding="sm">
            <EditableParagraph id="para-bigger-handfuls-setup" blockId="bigger-handfuls-setup">
                Now change one thing only: the{" "}
                <InlineSpotColor
                    varName="handfulColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('handfulColor'))}
                >
                    handful size
                </InlineSpotColor>
                , currently{" "}
                <InlineScrubbleNumber
                    varName="sketchSampleSize"
                    {...numberPropsFromDefinition(getVariableInfo('sketchSampleSize'))}
                />
                {" "}runners. Same school, same two hundred repeats, but{" "}
                <InlineTrigger varName="sketchSampleSize" value={2}>
                    handfuls of two
                </InlineTrigger>
                {" "}instead of five, or{" "}
                <InlineTrigger varName="sketchSampleSize" value={30} icon="zap">
                    handfuls of thirty
                </InlineTrigger>
                .
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-formula" maxWidth="xl">
        <Block id="bigger-handfuls-formula" padding="lg">
            <FormulaBlock
                latex={`\\textcolor{${PARTNER}}{\\text{handful average}} = \\frac{\\text{total of the times}}{\\scrub{sketchSampleSize}}`}
                variables={scrubVarsFromDefinitions(['sketchSampleSize'])}
                color={INK_STRONG}
            />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-invite" maxWidth="xl">
        <Block id="bigger-handfuls-invite" padding="sm">
            <EditableParagraph id="para-bigger-handfuls-invite" blockId="bigger-handfuls-invite">
                With handfuls of two, one very slow runner drags the average a long way, while in a handful
                of thirty that same runner is{" "}
                <InlineTooltip
                    id="tooltip-bigger-handfuls-diluted"
                    tooltip="Diluted: the extra seconds are shared between everyone in the handful, so each extra runner weakens their effect."
                >
                    diluted
                </InlineTooltip>
                {" "}by twenty-nine others. So draw the shape you expect straight onto the empty chart, then
                release two hundred handfuls and see how close you were.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-visual" maxWidth="xl">
        <Block id="bigger-handfuls-visual" padding="sm" hasVisualization>
            <SketchThePileFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-width-formula" maxWidth="xl">
        <Block id="bigger-handfuls-width-formula" padding="lg">
            <PileWidthFormula />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-reflect" maxWidth="xl">
        <Block id="bigger-handfuls-reflect" padding="sm">
            <EditableParagraph id="para-bigger-handfuls-reflect" blockId="bigger-handfuls-reflect">
                The runners scatter by about a second whatever you do, but that scatter gets shared out, so
                the width of the pile, its{" "}
                <InlineTooltip
                    id="tooltip-bigger-handfuls-standard-error"
                    tooltip="Standard error: how far a sample mean typically falls from the population mean. It shrinks with the square root of the sample size."
                >
                    standard error
                </InlineTooltip>
                , narrows by the square root of the sample size.{" "}
                <InlineLinkedHighlight
                    varName="sketchHighlight"
                    highlightId="sketch"
                    color={ACCENT}
                    bgColor={ACCENT_BG}
                >
                    Your sketch
                </InlineLinkedHighlight>
                {" "}stays put while{" "}
                <InlineLinkedHighlight
                    varName="sketchHighlight"
                    highlightId="pile"
                    color={PARTNER}
                    bgColor={PARTNER_BG}
                >
                    the real pile
                </InlineLinkedHighlight>
                {" "}pulls in tight around{" "}
                <InlineLinkedHighlight
                    varName="sketchHighlight"
                    highlightId="trueAverage"
                    color={INK_STRONG}
                    bgColor={INK_BG}
                >
                    the school&apos;s average
                </InlineLinkedHighlight>
                .
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-question-shape" maxWidth="xl">
        <Block id="bigger-handfuls-question-shape" padding="md">
            <EditableParagraph id="para-bigger-handfuls-question-shape" blockId="bigger-handfuls-question-shape">
                Next to a pile built from handfuls of 5, a pile built from handfuls of 30 is{" "}
                <InlineFeedback
                    varName="answer_bigger_handfuls_shape"
                    correctValue="narrower and taller"
                    position="terminal"
                    successMessage="— yes, the averages crowd in, so the same 200 handfuls stack into fewer columns"
                    failureMessage="— have another look."
                    hint="Every handful still counts once, so squeezing them into fewer columns has to make those columns taller"
                    visualizationHint={{
                        blockId: "bigger-handfuls-visual",
                        hintKey: "bigger-handfuls-shape-hint",
                        label: "Discover it yourself",
                        resetVars: { sketchSampleSize: 5, sketchRunCount: 0 },
                        steps: [
                            {
                                gesture: "click",
                                label: "Release 200 handfuls of 5 and look at how wide the pile spreads",
                                position: { x: "42%", y: "93%" },
                                completionVar: "sketchRunCount",
                                completionValue: 1,
                                completionTolerance: 0.5,
                            },
                            {
                                gesture: "drag-horizontal",
                                label: "Drag the handful size up to 30",
                                position: { x: "50%", y: "84%" },
                                dragPath: { type: "line", startOffset: { x: -40, y: 0 }, endOffset: { x: 40, y: 0 } },
                                completionVar: "sketchSampleSize",
                                completionValue: 30,
                                completionTolerance: 3,
                            },
                            {
                                gesture: "click",
                                label: "Release 200 more and compare the two piles",
                                position: { x: "42%", y: "93%" },
                                completionVar: "sketchRunCount",
                                completionValue: 2,
                                completionTolerance: 0.5,
                            },
                        ],
                    }}
                >
                    <InlineClozeChoice
                        varName="answer_bigger_handfuls_shape"
                        correctAnswer="narrower and taller"
                        options={["narrower and taller", "wider and flatter", "exactly the same"]}
                        {...choicePropsFromDefinition(getVariableInfo('answer_bigger_handfuls_shape'))}
                    />
                </InlineFeedback>.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-question-dilution" maxWidth="xl">
        <Block id="bigger-handfuls-question-dilution" padding="sm">
            <EditableParagraph id="para-bigger-handfuls-question-dilution" blockId="bigger-handfuls-question-dilution">
                In a handful of four runners, one of them stumbles and loses 4 extra seconds. Choose what
                those seconds get shared between, then say how far the handful average rises.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-dilution-formula" maxWidth="xl">
        <Block id="bigger-handfuls-dilution-formula" padding="lg">
            <FormulaBlock
                latex="\text{rise in the handful average} = \frac{\clr{extra}{4.0}}{\choice{answer_bigger_dilution_divisor}} = \cloze{answer_bigger_handfuls_dilution}\ \text{s}"
                colorMap={BIGGER_COLORS}
                clozeChoices={{
                    answer_bigger_dilution_divisor: {
                        correctAnswer: "4",
                        options: ["1", "2", "4"],
                        placeholder: "???",
                        color: '#62D0AD',
                        bgColor: 'rgba(98, 208, 173, 0.15)',
                    },
                }}
                clozeInputs={{
                    answer_bigger_handfuls_dilution: {
                        correctAnswer: "1 | 1.0",
                        placeholder: "???",
                        color: '#8E90F5',
                        bgColor: 'rgba(142, 144, 245, 0.15)',
                    },
                }}
            />
        </Block>
    </StackLayout>,
];
