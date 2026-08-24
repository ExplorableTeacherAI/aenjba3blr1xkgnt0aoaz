import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Figure } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";
import { clamp } from "@/lib/motion";
import { ACCENT, INK, INK_STRONG, PARTNER, clampLabelX } from "./figureStyle";

/**
 * Audition linked figures
 * =======================
 * TWO views of one idea, sharing `auditionShape` and `auditionHighlight`:
 *
 *   left  — the audition scores themselves, reshaped by dragging the bars
 *   right — the averages of every group of five dancers drawn from those scores
 *
 * Both views use the same score axis and both draw the same dashed average
 * line, so the tie between them is visible rather than assumed. Neither view
 * keeps its own copy of the data: they both read the store.
 */

const VIEWBOX_WIDTH = 420;
const VIEWBOX_HEIGHT = 300;
const PAD = 26;

const CHART_LEFT = 62;
const CHART_RIGHT = 388;
const CHART_TOP = 60;
const BASELINE_Y = 236;
const CHART_HEIGHT = BASELINE_Y - CHART_TOP;

const SCORE_COUNT = 10;
const MAX_DANCERS = 60;
const GROUP_SIZE = 5;

const DEFAULT_SHAPE = [55, 48, 34, 22, 14, 9, 6, 4, 3, 2];

const SCORE_TICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const DANCER_GRID = [20, 40, 60];

const xOfScore = (score: number) =>
    CHART_LEFT + ((score - 0.5) / SCORE_COUNT) * (CHART_RIGHT - CHART_LEFT);

const scorePitch = (CHART_RIGHT - CHART_LEFT) / SCORE_COUNT;
const barWidth = scorePitch - 8;

const yOfFraction = (fraction: number) => BASELINE_Y - clamp(fraction, 0, 1) * CHART_HEIGHT;

const formatShare = (share: number) => `${Math.round(share * 100)}%`;
const formatScore = (score: number) => score.toFixed(1);

const totalOf = (counts: number[]) => counts.reduce((sum, count) => sum + count, 0);

const meanScoreOf = (counts: number[]) => {
    const total = totalOf(counts);
    if (total === 0) return 0;
    return counts.reduce((sum, count, index) => sum + count * (index + 1), 0) / total;
};

/**
 * The exact distribution of the average of GROUP_SIZE scores, by convolution.
 * Index i is the average (GROUP_SIZE + i) / GROUP_SIZE, so the values step by
 * a fifth of a mark.
 */
const averageDistribution = (counts: number[]): number[] => {
    const total = totalOf(counts);
    if (total === 0) return [];
    const probability = counts.map((count) => count / total);
    let distribution = [...probability];
    for (let k = 1; k < GROUP_SIZE; k += 1) {
        const next = new Array(distribution.length + SCORE_COUNT - 1).fill(0);
        for (let i = 0; i < distribution.length; i += 1) {
            const weight = distribution[i];
            if (weight === 0) continue;
            for (let j = 0; j < SCORE_COUNT; j += 1) next[i + j] += weight * probability[j];
        }
        distribution = next;
    }
    return distribution;
};

const useAuditionState = () => {
    const setVar = useSetVar();
    const rawShape = useVar<number[]>("auditionShape", DEFAULT_SHAPE);
    const highlight = useVar<string>("auditionHighlight", "");
    const counts = Array.isArray(rawShape) && rawShape.length === SCORE_COUNT ? rawShape : DEFAULT_SHAPE;

    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("auditionHighlight", id),
        onPointerLeave: () => setVar("auditionHighlight", ""),
    });

    return { counts, highlight, dim, hoverProps, setVar };
};

/** The dashed average-score line, drawn identically in BOTH views. */
function MeanScoreMarker({
    meanScore,
    active,
    dimValue,
    hoverProps,
}: {
    meanScore: number;
    active: boolean;
    dimValue: number;
    hoverProps: Record<string, () => void>;
}) {
    if (meanScore <= 0) return null;
    const x = xOfScore(meanScore);
    const label = `average score ${formatScore(meanScore)}`;
    return (
        <g opacity={dimValue} style={{ transition: "opacity 150ms ease-out" }} {...hoverProps}>
            {active && (
                <line
                    x1={x}
                    y1={CHART_TOP - 8}
                    x2={x}
                    y2={BASELINE_Y + 8}
                    stroke={INK_STRONG}
                    strokeWidth="9"
                    opacity={0.28}
                    strokeLinecap="round"
                />
            )}
            <line
                x1={x}
                y1={CHART_TOP - 8}
                x2={x}
                y2={BASELINE_Y + 8}
                stroke={INK_STRONG}
                strokeWidth={active ? 3.5 : 2}
                strokeDasharray="6 6"
                strokeLinecap="round"
                style={{ transition: "stroke-width 150ms ease-out" }}
            />
            <text
                x={clampLabelX(x, label, VIEWBOX_WIDTH, PAD)}
                y={290}
                textAnchor="middle"
                fill={INK_STRONG}
                fontSize="12"
                style={{ fontVariantNumeric: "tabular-nums" }}
            >
                {label}
            </text>
        </g>
    );
}

function ScoreAxis({ dimValue }: { dimValue: number }) {
    return (
        <g opacity={dimValue} style={{ transition: "opacity 150ms ease-out" }}>
            <line
                x1={CHART_LEFT - 6}
                y1={BASELINE_Y}
                x2={CHART_RIGHT + 6}
                y2={BASELINE_Y}
                stroke={INK}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            {SCORE_TICKS.map((score) => (
                <text
                    key={score}
                    x={xOfScore(score)}
                    y={BASELINE_Y + 20}
                    textAnchor="middle"
                    fill={INK}
                    fontSize="11"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {score}
                </text>
            ))}
            <text x={VIEWBOX_WIDTH - PAD} y={BASELINE_Y + 38} textAnchor="end" fill={INK} fontSize="11">
                score out of 10
            </text>
        </g>
    );
}

/** LEFT VIEW — the audition scores, reshaped by dragging the bars. */
export function AuditionScoresFigure() {
    const { counts, highlight, dim, hoverProps, setVar } = useAuditionState();
    const [dragging, setDragging] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    const edits = useVar<number>("auditionEdits", 0);
    const total = totalOf(counts);
    const meanScore = meanScoreOf(counts);

    // A reset, from the chrome or from a feedback hint, restores the auditions.
    useEffect(() => {
        if (edits === 0) setVar("auditionShape", [...DEFAULT_SHAPE]);
    }, [edits, setVar]);

    useEffect(() => {
        const low = total === 0 ? 0 : ((counts[0] + counts[1] + counts[2]) / total) * 100;
        setVar("auditionLowShare", Math.round(low));
    }, [counts, total, setVar]);

    const paint = useCallback(
        (clientX: number, clientY: number) => {
            if (!svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const x = ((clientX - rect.left) / rect.width) * VIEWBOX_WIDTH;
            const y = ((clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT;
            const index = clamp(Math.floor((x - CHART_LEFT) / scorePitch), 0, SCORE_COUNT - 1);
            const fraction = clamp((BASELINE_Y - y) / CHART_HEIGHT, 0, 1);
            const next = [...counts];
            next[index] = Math.round(fraction * MAX_DANCERS);
            if (totalOf(next) === 0) next[index] = 1;
            setVar("auditionShape", next);
            setVar("auditionEdits", edits + 1);
        },
        [counts, edits, setVar],
    );

    const barsActive = highlight === "scores";

    return (
        <Figure
            id="audition-scores"
            onReset={() => setVar("auditionEdits", 0)}
            caption="The audition scores themselves. Drag any bar up or down to pile dancers onto different marks."
        >
            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="block w-full"
                role="img"
                aria-label="A draggable bar chart of how many dancers scored each mark out of ten"
            >
                <text x={PAD} y={22} fill={INK} fontSize="12">
                    dancers at each score
                </text>
                <text
                    x={VIEWBOX_WIDTH - PAD}
                    y={22}
                    textAnchor="end"
                    fill={INK}
                    fontSize="12"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {`${total} dancers`}
                </text>

                <g opacity={dim("grid")} style={{ transition: "opacity 150ms ease-out" }}>
                    {DANCER_GRID.map((value) => (
                        <g key={value}>
                            <line
                                x1={CHART_LEFT}
                                y1={yOfFraction(value / MAX_DANCERS)}
                                x2={CHART_RIGHT}
                                y2={yOfFraction(value / MAX_DANCERS)}
                                stroke="#E2E8F0"
                                strokeWidth="1.5"
                            />
                            <text
                                x={CHART_LEFT - 10}
                                y={yOfFraction(value / MAX_DANCERS) + 4}
                                textAnchor="end"
                                fill={INK}
                                fontSize="11"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {value}
                            </text>
                        </g>
                    ))}
                </g>

                <MeanScoreMarker
                    meanScore={meanScore}
                    active={highlight === "meanLine"}
                    dimValue={dim("meanLine")}
                    hoverProps={hoverProps("meanLine")}
                />

                <g
                    opacity={dim("scores")}
                    style={{ transition: "opacity 150ms ease-out" }}
                    {...hoverProps("scores")}
                >
                    {counts.map((count, index) => {
                        const y = yOfFraction(count / MAX_DANCERS);
                        return (
                            <rect
                                key={index}
                                x={xOfScore(index + 1) - barWidth / 2}
                                y={y}
                                width={barWidth}
                                height={Math.max(BASELINE_Y - y, 0)}
                                rx="3"
                                fill={ACCENT}
                                opacity={barsActive ? 1 : 0.85}
                                stroke={barsActive ? INK_STRONG : "transparent"}
                                strokeWidth={barsActive ? 1.5 : 0}
                                style={{ transition: "opacity 150ms ease-out" }}
                            />
                        );
                    })}
                </g>

                <ScoreAxis dimValue={dim("axis")} />

                <rect
                    x={CHART_LEFT}
                    y={CHART_TOP - 12}
                    width={CHART_RIGHT - CHART_LEFT}
                    height={CHART_HEIGHT + 12}
                    fill="transparent"
                    style={{ cursor: "ns-resize", touchAction: "none" }}
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        setDragging(true);
                        paint(event.clientX, event.clientY);
                    }}
                    onPointerMove={(event) => {
                        if (dragging) paint(event.clientX, event.clientY);
                    }}
                    onPointerUp={() => setDragging(false)}
                    onPointerCancel={() => setDragging(false)}
                />
            </svg>

            <InteractionHintSequence
                hintKey="audition-scores-drag"
                steps={[
                    {
                        gesture: "drag-vertical",
                        label: "Drag a bar up or down",
                        position: { x: "30%", y: "45%" },
                        dragPath: { type: "line", startOffset: { x: 0, y: -22 }, endOffset: { x: 0, y: 22 } },
                    },
                ]}
            />
        </Figure>
    );
}

/** RIGHT VIEW — the averages of every group of five, from the same scores. */
export function AuditionAveragesFigure() {
    const { counts, highlight, dim, hoverProps } = useAuditionState();

    const distribution = useMemo(() => averageDistribution(counts), [counts]);
    const peak = distribution.length > 0 ? Math.max(...distribution) : 0;
    const scaleMax = clamp(Math.ceil(peak * 20) / 20, 0.05, 1);
    const meanScore = meanScoreOf(counts);
    const averagesActive = highlight === "averages";

    const stepWidth = ((CHART_RIGHT - CHART_LEFT) / SCORE_COUNT / GROUP_SIZE) - 1.5;

    return (
        <Figure
            id="audition-averages"
            caption="The average score of every possible group of five dancers, drawn from the scores on the left."
        >
            <svg
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="block w-full"
                role="img"
                aria-label="The distribution of average scores for groups of five dancers"
            >
                <text x={PAD} y={22} fill={INK} fontSize="12">
                    averages of groups of 5
                </text>
                <text
                    x={VIEWBOX_WIDTH - PAD}
                    y={22}
                    textAnchor="end"
                    fill={PARTNER}
                    fontSize="12"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {`tallest column ${formatShare(peak)}`}
                </text>

                <g opacity={dim("grid")} style={{ transition: "opacity 150ms ease-out" }}>
                    {[scaleMax / 2, scaleMax].map((share) => (
                        <g key={share}>
                            <line
                                x1={CHART_LEFT}
                                y1={yOfFraction(share / scaleMax)}
                                x2={CHART_RIGHT}
                                y2={yOfFraction(share / scaleMax)}
                                stroke="#E2E8F0"
                                strokeWidth="1.5"
                            />
                            <text
                                x={CHART_LEFT - 10}
                                y={yOfFraction(share / scaleMax) + 4}
                                textAnchor="end"
                                fill={INK}
                                fontSize="11"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {formatShare(share)}
                            </text>
                        </g>
                    ))}
                </g>

                <MeanScoreMarker
                    meanScore={meanScore}
                    active={highlight === "meanLine"}
                    dimValue={dim("meanLine")}
                    hoverProps={hoverProps("meanLine")}
                />

                <g
                    opacity={dim("averages")}
                    style={{ transition: "opacity 150ms ease-out" }}
                    {...hoverProps("averages")}
                >
                    {distribution.map((share, index) => {
                        if (share <= 0) return null;
                        const average = (GROUP_SIZE + index) / GROUP_SIZE;
                        const y = yOfFraction(share / scaleMax);
                        return (
                            <rect
                                key={index}
                                x={xOfScore(average) - stepWidth / 2}
                                y={y}
                                width={stepWidth}
                                height={Math.max(BASELINE_Y - y, 0)}
                                fill={PARTNER}
                                opacity={averagesActive ? 1 : 0.8}
                                style={{ transition: "opacity 150ms ease-out" }}
                            />
                        );
                    })}
                </g>

                <ScoreAxis dimValue={dim("axis")} />
            </svg>
        </Figure>
    );
}
