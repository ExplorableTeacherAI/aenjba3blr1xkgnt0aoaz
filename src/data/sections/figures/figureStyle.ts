/** Shared ink, accent and formatting for this lesson's bespoke figures. */

export const INK = "#64748B";
export const INK_STRONG = "#475569";
export const POPULATION_COLOR = "#94A3B8";
/** The one accent hue: whatever the student manipulates. */
export const ACCENT = "#62D0AD";
/** The covariation partner: the averages that respond. */
export const PARTNER = "#8E90F5";

export const clampNumber = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

/** One formatter for every time this lesson prints, everywhere. */
export const formatTime = (value: number) => `${value.toFixed(1)} s`;

/**
 * Keep a middle-anchored label fully inside the viewBox.
 * Text width is estimated as characters x fontSize x 0.6.
 */
export const clampLabelX = (
    x: number,
    text: string,
    viewBoxWidth: number,
    pad: number,
    fontSize = 12,
) => {
    const half = (text.length * fontSize * 0.6) / 2;
    return clampNumber(x, pad + half, viewBoxWidth - pad - half);
};

/**
 * Background tints for inline components, so a phrase in the prose carries the
 * same identity as the element it points at in the figure.
 */
export const ACCENT_BG = "rgba(98, 208, 173, 0.2)";
export const PARTNER_BG = "rgba(142, 144, 245, 0.2)";
export const INK_BG = "rgba(71, 85, 105, 0.15)";
