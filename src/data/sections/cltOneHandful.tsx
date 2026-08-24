import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";
import { VisualOptionCards } from "@/components/organisms";

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
                Suppose the true average time across the whole school is 15.2 seconds. Nobody knows that
                number yet. The only way in is to pick a few runners and work out their average.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-worked-example" maxWidth="xl">
        <Block id="one-handful-worked-example" padding="sm">
            <EditableParagraph id="para-one-handful-worked-example" blockId="one-handful-worked-example">
                Here is one, worked through. Five runners come in at 14.1, 16.8, 15.0, 13.9 and 17.2
                seconds, which adds to 77.0, so their average is 15.4 seconds. Close to 15.2, but not equal
                to it.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-hook" maxWidth="xl">
        <Block id="one-handful-hook" padding="sm">
            <EditableParagraph id="para-one-handful-hook" blockId="one-handful-hook">
                That gap is not a mistake, and a different five runners would give a different answer,
                maybe 14.7, maybe 16.1. So how far off can a single handful be? Let&apos;s find out.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-one-handful-visual" maxWidth="xl">
        <Block id="one-handful-visual">
            <VisualOptionCards
                blockId="one-handful-visual"
                cards={[
                    {
                        id: "predict-where-average-lands",
                        title: "Every runner as a dot on a time line, with one dot for the sample average",
                        looks: "Imagine every runner in the school as a small dot along a time line, fastest on the left and slowest on the right, with the school's true average hidden. Five dots light up as a random handful, and their average drops onto the line beneath them.",
                        manipulate: "Mark on the line where they think the average of the next five runners will land, then draw the handful and see where it really falls",
                        reveals: "A sample average lands near the true average but almost never exactly on it, and the next handful lands somewhere else again.",
                        targetsMisconception: "One sample's average must equal the true average of everyone",
                        paradigm: "prediction",
                        recommended: true,
                    },
                    {
                        id: "build-your-own-handful",
                        title: "Runner cards students drop into a sample box that keeps a running average",
                        looks: "Imagine the school's runners as small cards spread across the screen, each showing a name and a time, and an empty box marked 'my sample' below them. As cards are dropped in, an average appears at the edge of the box and shifts with every card added.",
                        manipulate: "Drag runners of their own choosing into the sample box and watch the average move with each one",
                        reveals: "Which runners you happen to pick decides your average, which is why two honest samples disagree.",
                        paradigm: "constructivist",
                    },
                    {
                        id: "two-students-two-handfuls",
                        title: "The same school of runners shown twice, one handful picked in each copy",
                        looks: "Imagine the school's runners drawn twice, one copy for Amara and one for Ben. Each copy has its own five highlighted runners and its own average marked below, with a short line joining the two averages so the gap between them is easy to see.",
                        manipulate: "Swap runners in and out of either student's handful and compare where the two averages sit",
                        reveals: "Two people sampling the same school honestly end up with two different averages, and neither of them is wrong.",
                        paradigm: "comparison",
                    },
                ]}
            />
        </Block>
    </StackLayout>,
];
