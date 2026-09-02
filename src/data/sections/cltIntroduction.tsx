import { type ReactElement } from "react";
import { Block } from "@/components/templates";
import { StackLayout } from "@/components/layouts";
import {
    EditableH1,
    EditableParagraph,
    InlineSpotColor,
    InlineTooltip,
} from "@/components/atoms";
import { getVariableInfo, spotColorPropsFromDefinition } from "../variables";

export const cltIntroductionBlocks: ReactElement[] = [
    <StackLayout key="layout-intro-title" maxWidth="xl">
        <Block id="intro-title" padding="md">
            <EditableH1 id="h1-intro-title" blockId="intro-title">
                The Central Limit Theorem
            </EditableH1>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-sports-day" maxWidth="xl">
        <Block id="intro-sports-day" padding="sm">
            <EditableParagraph id="para-intro-sports-day" blockId="intro-sports-day">
                It is sports day, and two hundred students have just run the 100 metres. Finding the
                school&apos;s{" "}
                <InlineSpotColor
                    varName="trueMeanColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('trueMeanColor'))}
                >
                    true average
                </InlineSpotColor>
                {" "}means adding up all two hundred times, so instead you grab a{" "}
                <InlineSpotColor
                    varName="handfulColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('handfulColor'))}
                >
                    handful
                </InlineSpotColor>
                {" "}of five runners at random and{" "}
                <InlineTooltip
                    id="tooltip-intro-average"
                    tooltip="Add every value in the group, then share the total equally between them."
                >
                    average
                </InlineTooltip>
                {" "}only those. Then you do it again, and again, writing down each answer.
            </EditableParagraph>
        </Block>
    </StackLayout>,

    <StackLayout key="layout-intro-promise" maxWidth="xl">
        <Block id="intro-promise" padding="sm">
            <EditableParagraph id="para-intro-promise" blockId="intro-promise">
                Those{" "}
                <InlineSpotColor
                    varName="averageColor"
                    {...spotColorPropsFromDefinition(getVariableInfo('averageColor'))}
                >
                    answers
                </InlineSpotColor>
                {" "}are never all the same, but they are not scattered wildly either. They pile up into a
                shape, and the bigger your handful of runners, the more that shape settles into a smooth
                bell. By the end of this you will be able to describe how that bell appears, and all you
                need to begin is knowing how to work out an average.
            </EditableParagraph>
        </Block>
    </StackLayout>,
];
