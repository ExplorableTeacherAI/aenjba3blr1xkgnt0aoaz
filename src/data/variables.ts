/**
 * Variables Configuration
 * =======================
 * 
 * CENTRAL PLACE TO DEFINE ALL SHARED VARIABLES
 * 
 * This file defines all variables that can be shared across sections.
 * AI agents should read this file to understand what variables are available.
 * 
 * USAGE:
 * 1. Define variables here with their default values and metadata
 * 2. Use them in any section with: const x = useVar('variableName', defaultValue)
 * 3. Update them with: setVar('variableName', newValue)
 */

import { type VarValue } from '@/stores';

/**
 * Variable definition with metadata
 */
export interface VariableDefinition {
    /** Default value */
    defaultValue: VarValue;
    /** Human-readable label */
    label?: string;
    /** Description for AI agents */
    description?: string;
    /** Variable type hint */
    type?: 'number' | 'text' | 'boolean' | 'select' | 'array' | 'object' | 'spotColor' | 'linkedHighlight';
    /** Unit (e.g., 'Hz', '°', 'm/s') - for numbers */
    unit?: string;
    /** Minimum value (for number sliders) */
    min?: number;
    /** Maximum value (for number sliders) */
    max?: number;
    /** Step increment (for number sliders) */
    step?: number;
    /** Display color for InlineScrubbleNumber / InlineSpotColor (e.g. '#D81B60') */
    color?: string;
    /** Options for 'select' type variables */
    options?: string[];
    /** Placeholder text for text inputs */
    placeholder?: string;
    /**
     * Correct answer for cloze input validation.
     * Accepts a single string, pipe-separated alternates (e.g. "first | 1 | 1st"),
     * or an array of accepted answers (e.g. ["first", "1", "1st"]).
     */
    correctAnswer?: string | string[];
    /** Whether cloze matching is case sensitive */
    caseSensitive?: boolean;
    /** Background color for inline components */
    bgColor?: string;
    /** Schema hint for object types (for AI agents) */
    schema?: string;
}

/**
 * =====================================================
 * 🎯 DEFINE YOUR VARIABLES HERE
 * =====================================================
 * 
 * SUPPORTED TYPES:
 * 
 * 1. NUMBER (slider):
 *    { defaultValue: 5, type: 'number', min: 0, max: 10, step: 1 }
 * 
 * 2. TEXT (free text):
 *    { defaultValue: 'Hello', type: 'text', placeholder: 'Enter text...' }
 * 
 * 3. SELECT (dropdown):
 *    { defaultValue: 'sine', type: 'select', options: ['sine', 'cosine', 'tangent'] }
 * 
 * 4. BOOLEAN (toggle):
 *    { defaultValue: true, type: 'boolean' }
 * 
 * 5. ARRAY (list of numbers):
 *    { defaultValue: [1, 2, 3], type: 'array' }
 * 
 * 6. OBJECT (complex data):
 *    { defaultValue: { x: 5, y: 10 }, type: 'object', schema: '{ x: number, y: number }' }
 */
export const variableDefinitions: Record<string, VariableDefinition> = {
    // ─────────────────────────────────────────
    // Shared colour anchors
    // Teal = whatever the student manipulates (a handful, a sampler, a sketch),
    // indigo = the averages that answer back, slate = the school's true average,
    // violet = a total before it is shared out. These match the figures exactly.
    // ─────────────────────────────────────────
    handfulColor: {
        defaultValue: 'handful',
        type: 'text',
        label: 'Handful colour',
        description: 'Colour anchor for a handful of runners and its size',
        color: '#62D0AD',
    },
    averageColor: {
        defaultValue: 'average',
        type: 'text',
        label: 'Average colour',
        description: 'Colour anchor for a handful average and the pile of averages',
        color: '#8E90F5',
    },
    trueMeanColor: {
        defaultValue: 'true average',
        type: 'text',
        label: 'True average colour',
        description: "Colour anchor for the school's true average",
        color: '#475569',
    },
    totalColor: {
        defaultValue: 'total',
        type: 'text',
        label: 'Total colour',
        description: 'Colour anchor for a total before it is shared out',
        color: '#AC8BF9',
    },
    // ─────────────────────────────────────────
    // Section: One Handful of Runners
    // ─────────────────────────────────────────
    duelHandfulA: {
        defaultValue: [12, 47, 88, 131, 176],
        type: 'array',
        label: "Amara's handful",
        description: 'Which five runners are in the first handful',
    },
    duelHandfulB: {
        defaultValue: [5, 63, 99, 148, 190],
        type: 'array',
        label: "Ben's handful",
        description: 'Which five runners are in the second handful',
    },
    duelSwaps: {
        defaultValue: 0,
        type: 'number',
        label: 'Runner swaps',
        description: 'How many times a runner has been dragged in or out of a handful',
        min: 0,
        max: 999,
        step: 1,
        color: '#62D0AD',
    },
    duelRedraws: {
        defaultValue: 0,
        type: 'number',
        label: 'Fresh handfuls drawn',
        description: 'How many times both handfuls have been drawn again from scratch',
        min: 0,
        max: 99,
        step: 1,
        color: '#8E90F5',
    },
    duelHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Two handfuls figure highlight',
        description: 'Which element of the two-handfuls figure is highlighted on hover',
        color: '#475569',
        bgColor: 'rgba(71, 85, 105, 0.15)',
    },
    answer_one_handful_next: {
        defaultValue: '',
        type: 'select',
        label: 'Next handful answer',
        description: 'Student answer about how a fresh handful average compares with the true average',
        placeholder: '???',
        correctAnswer: 'close to 15.2 but usually not exactly 15.2',
        options: [
            'exactly 15.2',
            'close to 15.2 but usually not exactly 15.2',
            'nowhere near 15.2',
        ],
        color: '#8E90F5',
    },
    // ─────────────────────────────────────────
    // Section: Stacking Up the Averages
    // ─────────────────────────────────────────
    stackTilt: {
        defaultValue: 0,
        type: 'number',
        label: 'Sampler tilt',
        description: 'How far the sampler is tipped over, which sets how fast handfuls pour out',
        unit: 'degrees',
        min: 0,
        max: 70,
        step: 1,
        color: '#62D0AD',
    },
    stackPoured: {
        defaultValue: 0,
        type: 'number',
        label: 'Averages in the pile',
        description: 'How many handful averages have landed in the columns so far',
        min: 0,
        max: 300,
        step: 1,
        color: '#8E90F5',
    },
    stackHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Stacking figure highlight',
        description: 'Which element of the stacking figure is highlighted on hover',
        color: '#475569',
        bgColor: 'rgba(71, 85, 105, 0.15)',
    },
    answer_stacking_two_columns: {
        defaultValue: '',
        type: 'text',
        label: 'Two columns total',
        description: 'Student answer for the combined height of two neighbouring columns',
        placeholder: '???',
        correctAnswer: '21',
        color: '#8E90F5',
    },
    answer_stacking_tallest: {
        defaultValue: '',
        type: 'select',
        label: 'Tallest columns answer',
        description: 'Student answer about where the tallest columns end up',
        placeholder: '???',
        correctAnswer: 'near the middle, around 15.2 seconds',
        options: [
            'near the middle, around 15.2 seconds',
            'at the far left, with the fastest times',
            'spread evenly across every column',
        ],
        color: '#8E90F5',
    },
    // ─────────────────────────────────────────
    // Section: Bigger Handfuls
    // ─────────────────────────────────────────
    sketchSampleSize: {
        defaultValue: 5,
        type: 'number',
        label: 'Runners per handful',
        description: 'How many runners go into each handful before the average is taken',
        min: 2,
        max: 30,
        step: 1,
        color: '#62D0AD',
    },
    sketchRunCount: {
        defaultValue: 0,
        type: 'number',
        label: 'Runs completed',
        description: 'How many times 200 handfuls have been released into the chart',
        min: 0,
        max: 99,
        step: 1,
        color: '#8E90F5',
    },
    sketchHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Sketch figure highlight',
        description: 'Which element of the sketch figure is highlighted on hover',
        color: '#475569',
        bgColor: 'rgba(71, 85, 105, 0.15)',
    },
    answer_bigger_handfuls_shape: {
        defaultValue: '',
        type: 'select',
        label: 'Bigger handfuls shape',
        description: 'Student answer comparing piles from small and large handfuls',
        placeholder: '???',
        correctAnswer: 'narrower and taller',
        options: ['narrower and taller', 'wider and flatter', 'exactly the same'],
        color: '#8E90F5',
    },
    answer_bigger_dilution_divisor: {
        defaultValue: '',
        type: 'select',
        label: 'Dilution divisor',
        description: 'Student choice of what the extra seconds are shared between',
        placeholder: '???',
        correctAnswer: '4',
        options: ['1', '2', '4'],
        color: '#62D0AD',
    },
    answer_bigger_handfuls_dilution: {
        defaultValue: '',
        type: 'text',
        label: 'Dilution answer',
        description: 'Student answer for how much one slow runner shifts a handful average',
        placeholder: '???',
        correctAnswer: ['1', '1.0'],
        color: '#8E90F5',
    },
    // ─────────────────────────────────────────
    // Section: Lopsided Scores, Bell-Shaped Averages
    // ─────────────────────────────────────────
    auditionShape: {
        defaultValue: [55, 48, 34, 22, 14, 9, 6, 4, 3, 2],
        type: 'array',
        label: 'Audition score counts',
        description: 'How many dancers scored 1, 2, 3 ... 10 in the auditions',
    },
    auditionEdits: {
        defaultValue: 0,
        type: 'number',
        label: 'Score edits',
        description: 'How many times the student has reshaped the audition scores',
        min: 0,
        max: 999,
        step: 1,
        color: '#62D0AD',
    },
    auditionLowShare: {
        defaultValue: 0,
        type: 'number',
        label: 'Share scoring 1 to 3',
        description: 'Percentage of dancers whose audition score is 3 or below',
        unit: '%',
        min: 0,
        max: 100,
        step: 1,
        color: '#62D0AD',
    },
    auditionHighlight: {
        defaultValue: '',
        type: 'text',
        label: 'Audition figures highlight',
        description: 'Which element is highlighted across the linked audition figures',
        color: '#475569',
        bgColor: 'rgba(71, 85, 105, 0.15)',
    },
    answer_lopsided_shape: {
        defaultValue: '',
        type: 'select',
        label: 'Lopsided averages shape',
        description: 'Student answer about the shape of the averages from lopsided scores',
        placeholder: '???',
        correctAnswer: 'still bell-shaped',
        options: ['still bell-shaped', 'lopsided in the same way', 'flat and shapeless'],
        color: '#8E90F5',
    },
    answer_lopsided_group_mean: {
        defaultValue: '',
        type: 'text',
        label: 'Group average score',
        description: 'Student answer for the average of five given audition scores',
        placeholder: '???',
        correctAnswer: ['6', '6.0'],
        color: '#8E90F5',
    },
    answer_one_handful_mean: {
        defaultValue: '',
        type: 'text',
        label: 'Four sprinters average',
        description: 'Student answer for the average of four given sprint times',
        placeholder: '???',
        correctAnswer: ['15', '15.0'],
        color: '#8E90F5',
    },

    // ========================================
    // ADD YOUR VARIABLES HERE
    // ========================================

    // Uncomment and modify these examples for your lesson:

    /*
    // ─────────────────────────────────────────
    // NUMBER - Use with sliders
    // ─────────────────────────────────────────
    myValue: {
        defaultValue: 5,
        type: 'number',
        label: 'My Value',
        description: 'A number that controls something',
        unit: 'm',           // optional unit display
        min: 0,
        max: 10,
        step: 0.5,
    },

    // ─────────────────────────────────────────
    // TEXT - Free text input
    // ─────────────────────────────────────────
    lessonTitle: {
        defaultValue: 'My Lesson',
        type: 'text',
        label: 'Lesson Title',
        description: 'The title of your lesson',
        placeholder: 'Enter a title...',
    },

    // ─────────────────────────────────────────
    // SELECT - Dropdown with options
    // ─────────────────────────────────────────
    difficulty: {
        defaultValue: 'medium',
        type: 'select',
        label: 'Difficulty',
        description: 'The difficulty level of the lesson',
        options: ['easy', 'medium', 'hard', 'expert'],
    },

    // ─────────────────────────────────────────
    // BOOLEAN - Toggle switch
    // ─────────────────────────────────────────
    showHints: {
        defaultValue: true,
        type: 'boolean',
        label: 'Show Hints',
        description: 'Toggle to show or hide hints',
    },

    // ─────────────────────────────────────────
    // ARRAY - List of numbers
    // ─────────────────────────────────────────
    dataPoints: {
        defaultValue: [1, 4, 9, 16, 25],
        type: 'array',
        label: 'Data Points',
        description: 'Y-values for plotting a graph',
    },

    // ─────────────────────────────────────────
    // OBJECT - Complex structured data
    // ─────────────────────────────────────────
    graphSettings: {
        defaultValue: { 
            xMin: -10, 
            xMax: 10, 
            showGrid: true 
        },
        type: 'object',
        label: 'Graph Settings',
        description: 'Configuration for the graph display',
        schema: '{ xMin: number, xMax: number, showGrid: boolean }',
    },
    */
};

/**
 * Get all variable names (for AI agents to discover)
 */
export const getVariableNames = (): string[] => {
    return Object.keys(variableDefinitions);
};

/**
 * Get a variable's default value
 */
export const getDefaultValue = (name: string): VarValue => {
    return variableDefinitions[name]?.defaultValue ?? 0;
};

/**
 * Get a variable's metadata
 */
export const getVariableInfo = (name: string): VariableDefinition | undefined => {
    return variableDefinitions[name];
};

/**
 * Get all default values as a record (for initialization)
 */
export const getDefaultValues = (): Record<string, VarValue> => {
    const defaults: Record<string, VarValue> = {};
    for (const [name, def] of Object.entries(variableDefinitions)) {
        defaults[name] = def.defaultValue;
    }
    return defaults;
};

/**
 * Get number props for InlineScrubbleNumber from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
export function numberPropsFromDefinition(def: VariableDefinition | undefined): {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    color?: string;
} {
    if (!def || def.type !== 'number') return {};
    return {
        defaultValue: def.defaultValue as number,
        min: def.min,
        max: def.max,
        step: def.step,
        ...(def.color ? { color: def.color } : {}),
    };
}

/**
 * Get cloze input props for InlineClozeInput from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx, or getExampleVariableInfo(name) in exampleBlocks.tsx.
 */
/**
 * Get cloze choice props for InlineClozeChoice from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function choicePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Get toggle props for InlineToggle from a variable definition.
 * Use with getVariableInfo(name) in blocks.tsx.
 */
export function togglePropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    if (!def || def.type !== 'select') return {};
    return {
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

export function clozePropsFromDefinition(def: VariableDefinition | undefined): {
    placeholder?: string;
    color?: string;
    bgColor?: string;
    caseSensitive?: boolean;
} {
    if (!def || def.type !== 'text') return {};
    return {
        ...(def.placeholder ? { placeholder: def.placeholder } : {}),
        ...(def.color ? { color: def.color } : {}),
        ...(def.bgColor ? { bgColor: def.bgColor } : {}),
        ...(def.caseSensitive !== undefined ? { caseSensitive: def.caseSensitive } : {}),
    };
}

/**
 * Get spot-color props for InlineSpotColor from a variable definition.
 * Extracts the `color` field.
 *
 * @example
 * <InlineSpotColor
 *     varName="radius"
 *     {...spotColorPropsFromDefinition(getVariableInfo('radius'))}
 * >
 *     radius
 * </InlineSpotColor>
 */
export function spotColorPropsFromDefinition(def: VariableDefinition | undefined): {
    color: string;
} {
    return {
        color: def?.color ?? '#8B5CF6',
    };
}

/**
 * Get linked-highlight props for InlineLinkedHighlight from a variable definition.
 * Extracts the `color` and `bgColor` fields.
 *
 * @example
 * <InlineLinkedHighlight
 *     varName="activeHighlight"
 *     highlightId="radius"
 *     {...linkedHighlightPropsFromDefinition(getVariableInfo('activeHighlight'))}
 * >
 *     radius
 * </InlineLinkedHighlight>
 */
export function linkedHighlightPropsFromDefinition(def: VariableDefinition | undefined): {
    color?: string;
    bgColor?: string;
} {
    return {
        ...(def?.color ? { color: def.color } : {}),
        ...(def?.bgColor ? { bgColor: def.bgColor } : {}),
    };
}

/**
 * Build the `variables` prop for FormulaBlock from variable definitions.
 *
 * Takes an array of variable names and returns the config map expected by
 * `<FormulaBlock variables={...} />`.
 *
 * @example
 * import { scrubVarsFromDefinitions } from './variables';
 *
 * <FormulaBlock
 *     latex="\scrub{mass} \times \scrub{accel}"
 *     variables={scrubVarsFromDefinitions(['mass', 'accel'])}
 * />
 */
export function scrubVarsFromDefinitions(
    varNames: string[],
): Record<string, { min?: number; max?: number; step?: number; color?: string }> {
    const result: Record<string, { min?: number; max?: number; step?: number; color?: string }> = {};
    for (const name of varNames) {
        const def = variableDefinitions[name];
        if (!def) continue;
        result[name] = {
            ...(def.min !== undefined ? { min: def.min } : {}),
            ...(def.max !== undefined ? { max: def.max } : {}),
            ...(def.step !== undefined ? { step: def.step } : {}),
            ...(def.color ? { color: def.color } : {}),
        };
    }
    return result;
}
