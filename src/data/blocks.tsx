import { type ReactElement } from "react";

// Initialize variables and their colors from this file's variable definitions
import { useVariableStore, initializeVariableColors } from "@/stores";
import { getDefaultValues, variableDefinitions } from "./variables";
useVariableStore.getState().initialize(getDefaultValues());
initializeVariableColors(variableDefinitions);

import { cltIntroductionBlocks } from "./sections/cltIntroduction";
import { cltOneHandfulBlocks } from "./sections/cltOneHandful";
import { cltStackingAveragesBlocks } from "./sections/cltStackingAverages";
import { cltBiggerHandfulsBlocks } from "./sections/cltBiggerHandfuls";
import { cltLopsidedScoresBlocks } from "./sections/cltLopsidedScores";
import { cltWrappingUpBlocks } from "./sections/cltWrappingUp";

export const blocks: ReactElement[] = [
    ...cltIntroductionBlocks,
    ...cltOneHandfulBlocks,
    ...cltStackingAveragesBlocks,
    ...cltBiggerHandfulsBlocks,
    ...cltLopsidedScoresBlocks,
    ...cltWrappingUpBlocks,
];
