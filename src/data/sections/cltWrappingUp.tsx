import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import { EditableH2, EditableParagraph } from "@/components/atoms";

export const cltWrappingUpBlocks: ReactElement[] = [
    <StackLayout key="layout-wrapping-heading" maxWidth="xl">
        <Block id="wrapping-heading" padding="md">
            <EditableH2 id="h2-wrapping-heading" blockId="wrapping-heading">
                Wrapping Up
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-big-idea" maxWidth="xl">
        <Block id="wrapping-big-idea" padding="sm">
            <EditableParagraph id="para-wrapping-big-idea" blockId="wrapping-big-idea">
                The pile you kept building was never the shape of the runners or the dancers. It was the
                shape of their averages, and that shape hardly cares where it came from. Lopsided audition
                scores, a school full of ordinary sprinters: the averages settle into the same bell, and the
                bigger the handful, the tighter and smoother that bell becomes.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-whats-next" maxWidth="xl">
        <Block id="wrapping-whats-next" padding="sm">
            <EditableParagraph id="para-wrapping-whats-next" blockId="wrapping-whats-next">
                That is the central limit theorem, and it is why a survey of a thousand people can speak for
                a whole country, and why a judge trusts the average of five scorecards more than any single
                one of them. Next comes putting numbers on that bell: how wide it is, and how surprising a
                particular average really is.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
