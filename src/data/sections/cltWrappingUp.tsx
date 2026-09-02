import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH2,
    EditableParagraph,
    InlineFormula,
    InlineSpotColor,
    InlineTooltip,
} from "@/components/atoms";
import { getVariableInfo, spotColorPropsFromDefinition } from "../variables";

export const cltWrappingUpBlocks: ReactElement[] = [
    <StackLayout key="layout-wrapping-heading" maxWidth="xl">
        <Block id="wrapping-heading" padding="md">
            <EditableH2 id="h2-wrapping-heading" blockId="wrapping-heading">
                Summary: The Central Limit Theorem
            </EditableH2>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-big-idea" maxWidth="xl">
        <Block id="wrapping-big-idea" padding="sm">
            <EditableParagraph id="para-wrapping-big-idea" blockId="wrapping-big-idea">
                The pile you kept building was never the shape of the runners or the dancers. It was the
                shape of their{" "}
                <InlineSpotColor
                    varName="averageColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('averageColor'))}
                >
                    averages
                </InlineSpotColor>
                , and that shape hardly cares where it came from. Lopsided audition scores, a school full of
                ordinary sprinters: the averages settle into the same bell, centred on the{" "}
                <InlineSpotColor
                    varName="trueMeanColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('trueMeanColor'))}
                >
                    true average
                </InlineSpotColor>
                {" "}and narrowing as the{" "}
                <InlineTooltip
                    id="tooltip-wrapping-standard-error"
                    tooltip="Standard error (SE): the typical distance between a sample mean and the population mean, sigma over the square root of the sample size n."
                >
                    standard error
                </InlineTooltip>
                {" "}
                <InlineFormula
                    latex="\clr{spread}{\text{SE}} \approx \frac{\clr{scatter}{\sigma}}{\sqrt{\clr{count}{n}}}"
                    colorMap={{ spread: '#8E90F5', scatter: '#94A3B8', count: '#62D0AD' }}
                />
                {" "}shrinks with every extra runner in the sample.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-wrapping-whats-next" maxWidth="xl">
        <Block id="wrapping-whats-next" padding="sm">
            <EditableParagraph id="para-wrapping-whats-next" blockId="wrapping-whats-next">
                That is the{" "}
                <InlineTooltip
                    id="tooltip-wrapping-clt"
                    tooltip="Central limit theorem: whatever shape the original data has, the averages of random groups pile up into a bell."
                >
                    central limit theorem
                </InlineTooltip>
                , and it is why a survey of a thousand people can speak for
                a whole country, and why a judge trusts the average of five scorecards more than any single
                one of them. Next comes putting numbers on that bell: how wide it is, and how surprising a
                particular average really is.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
