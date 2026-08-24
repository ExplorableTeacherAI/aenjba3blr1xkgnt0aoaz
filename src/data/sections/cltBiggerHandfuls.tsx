import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                Now change one thing only: how many runners go into each handful. Same school, same hundred
                repeats, but handfuls of two instead of five, or handfuls of thirty.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-dilution" maxWidth="xl">
        <Block id="bigger-handfuls-dilution" padding="sm">
            <EditableParagraph id="para-bigger-handfuls-dilution" blockId="bigger-handfuls-dilution">
                With handfuls of two, one very slow runner drags the average a long way. With handfuls of
                thirty, that same slow runner is diluted by twenty-nine others, so the average barely
                shifts.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-hook" maxWidth="xl">
        <Block id="bigger-handfuls-hook" padding="sm">
            <EditableParagraph id="para-bigger-handfuls-hook" blockId="bigger-handfuls-hook">
                So the pile of averages must change as the handfuls grow. Wider or narrower, lumpy or
                smooth?
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-bigger-handfuls-visual" maxWidth="xl">
        <Block id="bigger-handfuls-visual">
            <VisualOptionCards
                blockId="bigger-handfuls-visual"
                cards={[
                    {
                        id: "two-piles-small-and-large",
                        title: "Two piles of averages one above the other, from small handfuls and from large",
                        looks: "Imagine two sets of columns stacked one above the other, both fed from the same school of runners. The top pile is built from small handfuls, the bottom from large ones, and a dashed line runs down through both marking the school's true average.",
                        manipulate: "Drag the handful size for each pile up and down and compare how far the two piles spread either side of the dashed line",
                        reveals: "Bigger handfuls give averages that crowd tightly around the true average and form a smoother bell.",
                        paradigm: "comparison",
                        recommended: true,
                    },
                    {
                        id: "sketch-the-pile-first",
                        title: "An empty chart with the true average marked, waiting for a hand-drawn outline",
                        looks: "Imagine the school's runners along the top and an empty chart below with the true average marked on it. Before any sampling starts the chart is blank, and once it begins the real columns build up from the bottom.",
                        manipulate: "Sketch the outline of the pile they expect for a chosen handful size, then release the handfuls and watch the real columns grow under their sketch",
                        reveals: "Students expect small handfuls to be dependable, and the real pile spreads far wider than the shape they drew.",
                        paradigm: "prediction",
                    },
                    {
                        id: "runners-beside-their-averages",
                        title: "The school's times on the left, the pile of their sample averages on the right",
                        looks: "Imagine every runner's time spread along a line on the left, never changing, and on the right a pile of averages from handfuls of a chosen size, with the same scale of seconds running under both so the two can be compared directly.",
                        manipulate: "Drag the handle that sets how many runners go into each handful and watch the right-hand pile narrow while the left-hand times stay exactly as they were",
                        reveals: "The original times never change shape at all; it is only the averages that tighten as the handfuls grow.",
                        paradigm: "conventional",
                        secondView: {
                            shows: "The pile of sample averages for the current handful size",
                            role: "complementary",
                            syncedBy: "sampleSize, plus a shared hover highlight linking the highlighted handful of runners to the average it produced",
                        },
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
