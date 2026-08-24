import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Figure, FigureSlider } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";
import { clamp, useRafLoop } from "@/lib/motion";
import { TRUE_MEAN, drawHandfulIndices, handfulMean } from "./sprintPopulation";
import { ACCENT, INK, INK_STRONG, PARTNER, clampLabelX, formatTime } from "./figureStyle";
import { getVariableInfo, numberPropsFromDefinition } from "../../variables";

/**
 * Sketch the pile figure
 * ======================
 * The student draws the shape they expect the pile of averages to take, for a
 * handful size of their choosing. Their sketch stays on the chart as a teal
 * outline while two hundred real handfuls build the pile underneath it, so the
 * guess and the answer are visible in the same frame.
 */

const VIEWBOX_WIDTH = 640;
const VIEWBOX_HEIGHT = 380;
const PAD = 32;

const CHART_LEFT = 72;
const CHART_RIGHT = 596;
const CHART_TOP = 90;
const BASELINE_Y = 300;

const BIN_WIDTH = 0.25;
const BIN_MIN = 13.2;
const BIN_COUNT = 16;
const BIN_MAX = BIN_MIN + BIN_WIDTH * BIN_COUNT;

const HANDFULS_PER_RUN = 200;
const MAX_SHARE = 0.7;
const RUN_SECONDS = 0.9;
const GRID_SHARES = [0.2, 0.4, 0.6];

const COLUMN_PITCH = (CHART_RIGHT - CHART_LEFT) / BIN_COUNT;
const COLUMN_WIDTH = COLUMN_PITCH - 5;
const TICKS = [13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17];

const xOfTime = (time: number) =>
    CHART_LEFT + ((time - BIN_MIN) / (BIN_MAX - BIN_MIN)) * (CHART_RIGHT - CHART_LEFT);

const columnX = (bin: number) => CHART_LEFT + bin * COLUMN_PITCH + 2.5;

const yOfShare = (share: number) =>
    BASELINE_Y - (clamp(share, 0, MAX_SHARE) / MAX_SHARE) * (BASELINE_Y - CHART_TOP);

const shareOfY = (y: number) =>
    clamp(((BASELINE_Y - y) / (BASELINE_Y - CHART_TOP)) * MAX_SHARE, 0, MAX_SHARE);

const binOfX = (x: number) => clamp(Math.floor((x - CHART_LEFT) / COLUMN_PITCH), 0, BIN_COUNT - 1);

const formatShare = (share: number) => `${Math.round(share * 100)}%`;

const runHandfuls = (size: number) => {
    const counts = new Array(BIN_COUNT).fill(0);
    for (let i = 0; i < HANDFULS_PER_RUN; i += 1) {
        const mean = handfulMean(drawHandfulIndices(size));
        const bin = clamp(Math.floor((mean - BIN_MIN) / BIN_WIDTH), 0, BIN_COUNT - 1);
        counts[bin] += 1;
    }
    return counts.map((count) => count / HANDFULS_PER_RUN);
};

export function SketchThePileFigure() {
    const setVar = useSetVar();
    const sampleSize = useVar<number>("sketchSampleSize", 5);
    const runCount = useVar<number>("sketchRunCount", 0);
    const highlight = useVar<string>("sketchHighlight", "");

    const [sketch, setSketch] = useState<number[]>(() => new Array(BIN_COUNT).fill(-1));
    const [shares, setShares] = useState<number[]>(() => new Array(BIN_COUNT).fill(0));
    const [progress, setProgress] = useState(1);
    const [drawing, setDrawing] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);
    const lastBinRef = useRef<number | null>(null);

    const hasSketch = sketch.some((value) => value >= 0);
    const hasRun = shares.some((value) => value > 0);

    // Changing the handful size clears the pile, so each run is a fair test.
    useEffect(() => {
        setShares(new Array(BIN_COUNT).fill(0));
        setProgress(1);
    }, [sampleSize]);

    // A reset, from the chrome or a feedback hint, clears everything.
    useEffect(() => {
        if (runCount === 0) {
            setShares(new Array(BIN_COUNT).fill(0));
            setSketch(new Array(BIN_COUNT).fill(-1));
            setProgress(1);
        }
    }, [runCount]);

    useRafLoop(
        (dt) => {
            setProgress((previous) => Math.min(1, previous + dt / RUN_SECONDS));
        },
        { paused: progress >= 1 },
    );

    const pointToChart = useCallback((clientX: number, clientY: number) => {
        if (!svgRef.current) return null;
        const rect = svgRef.current.getBoundingClientRect();
        return {
            x: ((clientX - rect.left) / rect.width) * VIEWBOX_WIDTH,
            y: ((clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT,
        };
    }, []);

    const paintSketch = useCallback(
        (clientX: number, clientY: number) => {
            const point = pointToChart(clientX, clientY);
            if (!point) return;
            const bin = binOfX(point.x);
            const share = shareOfY(point.y);
            setSketch((previous) => {
                const next = [...previous];
                const from = lastBinRef.current;
                if (from === null || from === bin) {
                    next[bin] = share;
                } else {
                    // fill in the bins the pointer swept over, so a fast drag
                    // still leaves a continuous outline
                    const step = from < bin ? 1 : -1;
                    const startShare = previous[from] >= 0 ? previous[from] : share;
                    const span = Math.abs(bin - from);
                    for (let i = 0; i <= span; i += 1) {
                        const index = from + i * step;
                        next[index] = startShare + ((share - startShare) * i) / span;
                    }
                }
                lastBinRef.current = bin;
                return next;
            });
        },
        [pointToChart],
    );

    const runOnce = useCallback(() => {
        setShares(runHandfuls(sampleSize));
        setProgress(0);
        setVar("sketchRunCount", runCount + 1);
    }, [runCount, sampleSize, setVar]);

    const handleReset = useCallback(() => {
        setVar("sketchRunCount", 0);
        setVar("sketchSampleSize", 5);
    }, [setVar]);

    const peakShare = useMemo(() => Math.max(0, ...shares) * progress, [shares, progress]);

    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const sketchActive = highlight === "sketch";
    const pileActive = highlight === "pile";
    const trueActive = highlight === "trueAverage";
    const trueX = xOfTime(TRUE_MEAN);
    const trueLabel = `school average ${formatTime(TRUE_MEAN)}`;

    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("sketchHighlight", id),
        onPointerLeave: () => setVar("sketchHighlight", ""),
    });

    const sketchPath = useMemo(() => {
        const segments: string[] = [];
        let open = false;
        sketch.forEach((share, bin) => {
            if (share < 0) {
                open = false;
                return;
            }
            const y = yOfShare(share);
            const left = columnX(bin);
            const right = left + COLUMN_WIDTH;
            segments.push(`${open ? "L" : "M"} ${left.toFixed(1)} ${y.toFixed(1)}`);
            segments.push(`L ${right.toFixed(1)} ${y.toFixed(1)}`);
            open = true;
        });
        return segments.join(" ");
    }, [sketch]);

    return (
        <Figure
            id="sketch-the-pile"
            onReset={handleReset}
            caption="Draw the shape you expect straight onto the chart, choose how many runners go in each handful, then release two hundred handfuls and compare."
        >
            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="block w-full"
                role="img"
                aria-label="A chart where the student sketches the expected pile of averages before two hundred handfuls build the real one"
            >
                <text x={PAD} y={22} fill={INK} fontSize="12" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {`200 handfuls of ${sampleSize} runners`}
                </text>
                <text
                    x={VIEWBOX_WIDTH - PAD}
                    y={22}
                    textAnchor="end"
                    fill={hasRun ? PARTNER : INK}
                    fontSize="12"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {hasRun ? `tallest column ${formatShare(peakShare)}` : "nothing released yet"}
                </text>

                {/* grid and vertical scale */}
                <g opacity={dim("grid")} style={{ transition: "opacity 150ms ease-out" }}>
                    {GRID_SHARES.map((share) => (
                        <g key={share}>
                            <line
                                x1={CHART_LEFT}
                                y1={yOfShare(share)}
                                x2={CHART_RIGHT}
                                y2={yOfShare(share)}
                                stroke="#E2E8F0"
                                strokeWidth="1.5"
                            />
                            <text
                                x={CHART_LEFT - 10}
                                y={yOfShare(share) + 4}
                                textAnchor="end"
                                fill={INK}
                                fontSize="11"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {formatShare(share)}
                            </text>
                        </g>
                    ))}
                    <text x={PAD} y={CHART_TOP - 14} fill={INK} fontSize="11">
                        share of the handfuls
                    </text>
                </g>

                {/* the school's true average */}
                <g
                    opacity={dim("trueAverage")}
                    style={{ transition: "opacity 150ms ease-out" }}
                    {...hoverProps("trueAverage")}
                >
                    {trueActive && (
                        <line
                            x1={trueX}
                            y1={CHART_TOP - 6}
                            x2={trueX}
                            y2={BASELINE_Y + 8}
                            stroke={INK_STRONG}
                            strokeWidth="9"
                            opacity={0.28}
                            strokeLinecap="round"
                        />
                    )}
                    <line
                        x1={trueX}
                        y1={CHART_TOP - 6}
                        x2={trueX}
                        y2={BASELINE_Y + 8}
                        stroke={INK_STRONG}
                        strokeWidth={trueActive ? 3.5 : 2}
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                        style={{ transition: "stroke-width 150ms ease-out" }}
                    />
                    <text
                        x={clampLabelX(trueX, trueLabel, VIEWBOX_WIDTH, PAD)}
                        y={356}
                        textAnchor="middle"
                        fill={INK_STRONG}
                        fontSize="12"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                        {trueLabel}
                    </text>
                </g>

                {/* the real pile */}
                <g
                    opacity={dim("pile")}
                    style={{ transition: "opacity 150ms ease-out" }}
                    {...hoverProps("pile")}
                >
                    {shares.map((share, bin) => {
                        const shown = share * progress;
                        if (shown <= 0) return null;
                        const y = yOfShare(shown);
                        return (
                            <rect
                                key={bin}
                                x={columnX(bin)}
                                y={y}
                                width={COLUMN_WIDTH}
                                height={BASELINE_Y - y}
                                rx="2"
                                fill={PARTNER}
                                opacity={pileActive ? 0.95 : 0.75}
                                stroke={pileActive ? INK_STRONG : "transparent"}
                                strokeWidth={pileActive ? 1.5 : 0}
                                style={{ transition: "opacity 150ms ease-out" }}
                            />
                        );
                    })}
                </g>

                {/* the student's own sketch, drawn straight onto the chart */}
                {hasSketch && (
                    <g
                        opacity={dim("sketch")}
                        style={{ transition: "opacity 150ms ease-out" }}
                        {...hoverProps("sketch")}
                    >
                        {sketchActive && (
                            <path d={sketchPath} stroke={ACCENT} strokeWidth="10" opacity={0.28} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        )}
                        <path
                            d={sketchPath}
                            stroke={ACCENT}
                            strokeWidth={sketchActive ? 5 : 3.5}
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ transition: "stroke-width 150ms ease-out" }}
                        />
                    </g>
                )}

                {/* axis */}
                <g opacity={dim("axis")} style={{ transition: "opacity 150ms ease-out" }}>
                    <line
                        x1={CHART_LEFT - 6}
                        y1={BASELINE_Y}
                        x2={CHART_RIGHT + 6}
                        y2={BASELINE_Y}
                        stroke={INK}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    {TICKS.map((tick) => (
                        <g key={tick}>
                            <line
                                x1={xOfTime(tick)}
                                y1={BASELINE_Y}
                                x2={xOfTime(tick)}
                                y2={BASELINE_Y + 6}
                                stroke={INK}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <text
                                x={xOfTime(tick)}
                                y={BASELINE_Y + 22}
                                textAnchor="middle"
                                fill={INK}
                                fontSize="11"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {tick.toFixed(1)}
                            </text>
                        </g>
                    ))}
                    <text x={VIEWBOX_WIDTH - PAD} y={356} textAnchor="end" fill={INK} fontSize="11">
                        seconds
                    </text>
                </g>

                {/* drawing surface, on top so the whole chart is sketchable */}
                <rect
                    x={CHART_LEFT}
                    y={CHART_TOP - 10}
                    width={CHART_RIGHT - CHART_LEFT}
                    height={BASELINE_Y - CHART_TOP + 10}
                    fill="transparent"
                    style={{ cursor: "crosshair", touchAction: "none" }}
                    onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        setDrawing(true);
                        lastBinRef.current = null;
                        paintSketch(event.clientX, event.clientY);
                    }}
                    onPointerMove={(event) => {
                        if (drawing) paintSketch(event.clientX, event.clientY);
                    }}
                    onPointerUp={() => {
                        setDrawing(false);
                        lastBinRef.current = null;
                    }}
                    onPointerCancel={() => {
                        setDrawing(false);
                        lastBinRef.current = null;
                    }}
                />
            </svg>

            <div className="flex flex-col gap-3 px-6 pb-5">
                <FigureSlider
                    varName="sketchSampleSize"
                    label="Runners per handful"
                    {...numberPropsFromDefinition(getVariableInfo('sketchSampleSize'))}
                    formatValue={(value) => `${Math.round(value)}`}
                />
                <div className="flex items-center justify-center gap-3">
                    <button
                        type="button"
                        onClick={runOnce}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                    >
                        Release 200 handfuls
                    </button>
                    <button
                        type="button"
                        onClick={() => setSketch(new Array(BIN_COUNT).fill(-1))}
                        className="rounded-lg px-3 py-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
                    >
                        Clear sketch
                    </button>
                </div>
            </div>

            <InteractionHintSequence
                hintKey="sketch-the-pile"
                currentStep={hasSketch ? 1 : 0}
                steps={[
                    {
                        gesture: "drag",
                        label: "Draw the shape you expect across the chart",
                        position: { x: "50%", y: "45%" },
                        dragPath: { type: "line", startOffset: { x: -40, y: 20 }, endOffset: { x: 40, y: 20 } },
                    },
                    {
                        gesture: "click",
                        label: "Now release 200 handfuls",
                        position: { x: "42%", y: "93%" },
                    },
                ]}
            />
        </Figure>
    );
}
