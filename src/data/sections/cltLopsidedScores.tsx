import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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

    <StackLayout key="layout-lopsided-sampling" maxWidth="xl">
        <Block id="lopsided-sampling" padding="sm">
            <EditableParagraph id="para-lopsided-sampling" blockId="lopsided-sampling">
                Now take five dancers at random, average their scores, and repeat that a few hundred times.
                The lopsided pile of scores stays lopsided, because that pile is the data itself.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lopsided-hook" maxWidth="xl">
        <Block id="lopsided-hook" padding="sm">
            <EditableParagraph id="para-lopsided-hook" blockId="lopsided-hook">
                But the pile of averages is a different pile altogether. What shape does that one take?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-lopsided-visual" maxWidth="xl">
        <Block id="lopsided-visual">
            <VisualOptionCards
                blockId="lopsided-visual"
                cards={[
                    {
                        id: "scores-beside-their-averages",
                        title: "The lopsided audition scores on the left, the pile of their averages on the right",
                        looks: "Imagine a chart of audition scores bunched hard at the low end with a long tail of high scorers, and beside it a second, empty chart where the average of each random group of dancers lands. As groups are drawn, the right-hand chart fills while the left-hand one never changes.",
                        manipulate: "Reshape the score chart itself by dragging its bars, piling dancers up at one end, and watch what the averages on the right do about it",
                        reveals: "However lopsided the original scores are, their averages still pile up into a bell.",
                        targetsMisconception: "You only get a bell curve if the original data is already bell-shaped",
                        paradigm: "comparison",
                        recommended: true,
                        secondView: {
                            shows: "The pile of averages of random groups of dancers drawn from the current score chart",
                            role: "complementary",
                            syncedBy: "the score-shape and group-size variables, plus a shared hover highlight linking a drawn group to the average it produced",
                        },
                    },
                    {
                        id: "sketch-the-expected-shape",
                        title: "The lopsided scores above an empty chart waiting for a hand-drawn guess",
                        looks: "Imagine the lopsided audition scores drawn across the top of the screen and an empty chart directly below them. The lower chart stays blank until the sampling starts, and then the averages of random groups build up inside it.",
                        manipulate: "Draw the shape they expect the averages to make, leaving their sketch on screen as a faint outline while the real averages build up over it",
                        reveals: "Most students draw a lopsided shape, and the bell that appears instead is the surprise.",
                        targetsMisconception: "You only get a bell curve if the original data is already bell-shaped",
                        paradigm: "prediction",
                    },
                    {
                        id: "build-a-strange-score-shape",
                        title: "An empty score grid students fill dancer by dancer, with a pile of averages beneath",
                        looks: "Imagine an empty grid where every click stacks another dancer onto a score out of ten, so any spiky, lopsided or two-humped set of scores can be built. Underneath it sits a second pile, made from the averages of random groups of five, rebuilding itself as the grid changes.",
                        manipulate: "Stack dancers onto whichever scores they like to build a deliberately strange shape",
                        reveals: "No matter how strange the shape students invent, the averages underneath keep forming a bell.",
                        targetsMisconception: "You only get a bell curve if the original data is already bell-shaped",
                        paradigm: "constructivist",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
