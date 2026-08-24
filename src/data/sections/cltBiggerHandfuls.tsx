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
import { SketchThePileFigure } from "./figures/SketchThePileFigure";

export const cltBiggerHandfulsBlocks: ReactElement[] = [
    <StackLayout key="layout-bigger-handfuls-heading" maxWidth="xl">
        <Block id="bigger-handfuls-heading" padding="md">
            <EditableH2 id="h2-bigger-handfuls-heading" blockId="bigger-handfuls-heading">
                Bigger Handfuls
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-setup" maxWidth="xl">
        <Block id="bigger-handfuls-setup" padding="sm">
            <EditableParagraph id="para-bigger-handfuls-setup" blockId="bigger-handfuls-setup">
                Now change one thing only: how many runners go into each handful. Same school, same two
                hundred repeats, but handfuls of two instead of five, or handfuls of thirty.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-invite" maxWidth="xl">
        <Block id="bigger-handfuls-invite" padding="sm">
            <EditableParagraph id="para-bigger-handfuls-invite" blockId="bigger-handfuls-invite">
                With handfuls of two, one very slow runner drags the average a long way, while in a handful
                of thirty that same runner is diluted by twenty-nine others. So draw the shape you expect
                straight onto the empty chart, then release two hundred handfuls and see how close you were.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-visual" maxWidth="xl">
        <Block id="bigger-handfuls-visual" padding="sm" hasVisualization>
            <SketchThePileFigure />
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-reflect" maxWidth="xl">
        <Block id="bigger-handfuls-reflect" padding="sm">
            <EditableParagraph id="para-bigger-handfuls-reflect" blockId="bigger-handfuls-reflect">
                <InlineLinkedHighlight
                    varName="sketchHighlight"
                    highlightId="sketch"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('sketchHighlight'))}
                >
                    Your sketch
                </InlineLinkedHighlight>
                {" "}stays put while{" "}
                <InlineLinkedHighlight
                    varName="sketchHighlight"
                    highlightId="pile"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('sketchHighlight'))}
                >
                    the real pile
                </InlineLinkedHighlight>
                {" "}builds underneath it. Push the handful size up and release again: the pile pulls in
                tight around{" "}
                <InlineLinkedHighlight
                    varName="sketchHighlight"
                    highlightId="trueAverage"
                    {...linkedHighlightPropsFromDefinition(getVariableInfo('sketchHighlight'))}
                >
                    the school&apos;s average
                </InlineLinkedHighlight>
                {" "}and its tallest column climbs.
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
        <Block id="bigger-handfuls-question-dilution" padding="md">
            <EditableParagraph id="para-bigger-handfuls-question-dilution" blockId="bigger-handfuls-question-dilution">
                In a handful of four runners, one of them stumbles and loses 4 seconds. The handful&apos;s
                average goes up by{" "}
                <InlineFeedback
                    varName="answer_bigger_handfuls_dilution"
                    correctValue={["1", "1.0"]}
                    position="terminal"
                    successMessage="— exactly, those 4 seconds are shared out between all four runners"
                    failureMessage="— not quite."
                    hint="The extra seconds are shared between everyone in the handful, so divide before you decide"
                    reviewBlockId="bigger-handfuls-invite"
                    reviewLabel="Review this idea"
                >
                    <InlineClozeInput
                        varName="answer_bigger_handfuls_dilution"
                        correctAnswer={["1", "1.0"]}
                        {...clozePropsFromDefinition(getVariableInfo('answer_bigger_handfuls_dilution'))}
                    />
                </InlineFeedback>
                {" "}second.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
