import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                One handful tells you very little. A hundred handfuls tell you a lot, because now you can
                sort the answers into columns: every average between 14.5 and 15.0 seconds goes in one
                column, every average between 15.0 and 15.5 in the next.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-reading-columns" maxWidth="xl">
        <Block id="stacking-reading-columns" padding="sm">
            <EditableParagraph id="para-stacking-reading-columns" blockId="stacking-reading-columns">
                A column ten blocks tall means ten different handfuls landed in that range. Tall columns
                sit where averages happen often, short columns where they happen rarely. That is all this
                kind of picture is: counting, stacked up.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-hook" maxWidth="xl">
        <Block id="stacking-hook" padding="sm">
            <EditableParagraph id="para-stacking-hook" blockId="stacking-hook">
                So which columns grow tall first, and what does the whole pile look like once a hundred
                handfuls are in?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-stacking-visual" maxWidth="xl">
        <Block id="stacking-visual">
            <VisualOptionCards
                blockId="stacking-visual"
                cards={[
                    {
                        id: "place-each-average-by-hand",
                        title: "A loose average block and an empty grid of columns waiting underneath",
                        looks: "Imagine a strip of the school's runners along the top and an empty grid of columns below, each column labelled with a range of times. A random handful of five lights up, its average appears as a single loose block, and the block waits to be put somewhere.",
                        manipulate: "Drop each new average block into the column it belongs in, building the pile by hand handful after handful",
                        reveals: "Sorting averages into columns is just counting, and the counts pile up highest in the middle.",
                        paradigm: "constructivist",
                        recommended: true,
                    },
                    {
                        id: "pour-the-handfuls-in",
                        title: "A sampler that drops handfuls into columns, one at a time or in a stream",
                        looks: "Imagine the school's runners along the top and a row of empty columns beneath them. Each time a handful of five is released, its average falls like a coin into whichever column it belongs to, and that column grows one block taller.",
                        manipulate: "Tip the sampler with a drag to release handfuls, slowly one by one or in a fast stream, and watch which columns rise",
                        reveals: "Averages near the middle happen far more often than extreme ones, so the pile grows tallest in the centre.",
                        paradigm: "temporal",
                    },
                    {
                        id: "capture-band-over-the-pile",
                        title: "A pile of sample averages with a shaded band stretched across it",
                        looks: "Imagine columns of sample averages building up over the school's true average, with a shaded band lying across the middle of them. A small counter at the side shows how many of the handfuls so far have landed inside the band.",
                        manipulate: "Drag the two edges of the band inwards and outwards until it captures most of the handfuls",
                        reveals: "Most sample averages sit inside a surprisingly narrow band, and only a few stray far from it.",
                        paradigm: "goal",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
