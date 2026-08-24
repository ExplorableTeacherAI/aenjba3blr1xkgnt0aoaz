import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Figure } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";
import {
    POPULATION as RUNNERS,
    TRUE_MEAN,
    drawHandfulIndices,
    handfulMean,
} from "./sprintPopulation";
import { ACCENT, INK, INK_STRONG, PARTNER, POPULATION_COLOR, clampLabelX, formatTime } from "./figureStyle";

/**
 * Two handfuls figure
 * ===================
 * The same school of runners, drawn twice. Amara has five runners, Ben has five
 * others, and each handful's average is projected down onto the one shared time
 * axis. Dragging any highlighted runner snaps it onto a different runner, so a
 * student can see one honest handful disagree with another.
 */

const VIEWBOX_WIDTH = 640;
const VIEWBOX_HEIGHT = 336;
const PAD = 32;

const AXIS_LEFT = 70;
const AXIS_RIGHT = 580;
const TIME_MIN = 12.5;
const TIME_MAX = 18.5;

const BAND_HEIGHT = 60;
const BAND_A_TOP = 50;
const BAND_B_TOP = 168;
const MEAN_A_Y = 128;
const MEAN_B_Y = 246;
const LABEL_A_Y = 147;
const LABEL_B_Y = 265;
const AXIS_Y = 286;
const TICK_LABEL_Y = 302;
const TRUE_LABEL_Y = 322;

const HANDFUL_SIZE = 5;
const TICKS = [13, 14, 15, 16, 17, 18];

const xOfTime = (time: number) =>
    AXIS_LEFT + ((time - TIME_MIN) / (TIME_MAX - TIME_MIN)) * (AXIS_RIGHT - AXIS_LEFT);

const yInBand = (jitter: number, bandTop: number) => bandTop + jitter * BAND_HEIGHT;

interface SideConfig {
    key: "amara" | "ben";
    name: string;
    color: string;
    varName: string;
    bandTop: number;
    meanY: number;
    labelY: number;
}

const SIDES: SideConfig[] = [
    {
        key: "amara",
        name: "Amara",
        color: ACCENT,
        varName: "duelHandfulA",
        bandTop: BAND_A_TOP,
        meanY: MEAN_A_Y,
        labelY: LABEL_A_Y,
    },
    {
        key: "ben",
        name: "Ben",
        color: PARTNER,
        varName: "duelHandfulB",
        bandTop: BAND_B_TOP,
        meanY: MEAN_B_Y,
        labelY: LABEL_B_Y,
    },
];

export function TwoHandfulsFigure() {
    const setVar = useSetVar();
    const rawA = useVar<number[]>("duelHandfulA", []);
    const rawB = useVar<number[]>("duelHandfulB", []);
    const swaps = useVar<number>("duelSwaps", 0);
    const redraws = useVar<number>("duelRedraws", 0);
    const highlight = useVar<string>("duelHighlight", "");

    const [dragging, setDragging] = useState<{ side: number; slot: number } | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    const handfuls = useMemo(() => {
        const valid = (value: number[]) =>
            Array.isArray(value) && value.length === HANDFUL_SIZE && value.every((i) => RUNNERS[i]);
        return [valid(rawA) ? rawA : [], valid(rawB) ? rawB : []];
    }, [rawA, rawB]);

    const ready = handfuls[0].length === HANDFUL_SIZE && handfuls[1].length === HANDFUL_SIZE;

    const dealFresh = useCallback(() => {
        setVar("duelHandfulA", drawHandfulIndices(HANDFUL_SIZE));
        setVar("duelHandfulB", drawHandfulIndices(HANDFUL_SIZE));
    }, [setVar]);

    // Reset, from the chrome or from a feedback hint, deals two fresh handfuls.
    useEffect(() => {
        if (swaps === 0 && redraws === 0) dealFresh();
    }, [swaps, redraws, dealFresh]);

    const snapToNearest = useCallback(
        (sideIndex: number, slot: number, clientX: number, clientY: number) => {
            if (!svgRef.current || !ready) return;
            const side = SIDES[sideIndex];
            const rect = svgRef.current.getBoundingClientRect();
            const x = ((clientX - rect.left) / rect.width) * VIEWBOX_WIDTH;
            const y = ((clientY - rect.top) / rect.height) * VIEWBOX_HEIGHT;
            const current = handfuls[sideIndex];

            let bestIndex = current[slot];
            let bestDistance = Number.POSITIVE_INFINITY;
            RUNNERS.forEach((runner, index) => {
                if (current.includes(index) && index !== current[slot]) return;
                const dx = xOfTime(runner.time) - x;
                const dy = yInBand(runner.jitter, side.bandTop) - y;
                const distance = dx * dx + dy * dy;
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestIndex = index;
                }
            });

            if (bestIndex === current[slot]) return;
            const next = [...current];
            next[slot] = bestIndex;
            setVar(side.varName, next);
            setVar("duelSwaps", swaps + 1);
        },
        [handfuls, ready, setVar, swaps],
    );

    const means = handfuls.map((indices) =>
        indices.length === HANDFUL_SIZE ? Math.round(handfulMean(indices) * 10) / 10 : 0,
    );
    const gap = ready ? Math.abs(means[0] - means[1]) : 0;

    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const trueActive = highlight === "trueAverage";
    const trueX = xOfTime(TRUE_MEAN);
    const trueLabel = `school average ${formatTime(TRUE_MEAN)}`;

    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("duelHighlight", id),
        onPointerLeave: () => setVar("duelHighlight", ""),
    });

    return (
        <Figure
            id="two-handfuls"
            onReset={() => {
                setVar("duelSwaps", 0);
                setVar("duelRedraws", 0);
                dealFresh();
            }}
            caption="The same 200 runners, shown twice. Drag any of Amara's or Ben's highlighted runners onto a different runner, and watch the two averages move apart."
        >
            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="block w-full"
                role="img"
                aria-label="The same school of runners shown twice, with a different handful of five highlighted in each copy"
            >
                <text x={PAD} y={20} fill={INK} fontSize="12">
                    the same 200 runners, twice
                </text>
                <text
                    x={VIEWBOX_WIDTH - PAD}
                    y={20}
                    textAnchor="end"
                    fill={INK_STRONG}
                    fontSize="12"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {`their averages differ by ${gap.toFixed(1)} s`}
                </text>

                {/* the school's true average, running through both copies */}
                <g
                    opacity={dim("trueAverage")}
                    style={{ transition: "opacity 150ms ease-out" }}
                    {...hoverProps("trueAverage")}
                >
                    {trueActive && (
                        <line
                            x1={trueX}
                            y1={42}
                            x2={trueX}
                            y2={AXIS_Y + 6}
                            stroke={INK_STRONG}
                            strokeWidth="9"
                            opacity={0.28}
                            strokeLinecap="round"
                        />
                    )}
                    <line
                        x1={trueX}
                        y1={42}
                        x2={trueX}
                        y2={AXIS_Y + 6}
                        stroke={INK_STRONG}
                        strokeWidth={trueActive ? 3.5 : 2}
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                        style={{ transition: "stroke-width 150ms ease-out" }}
                    />
                    <text
                        x={clampLabelX(trueX, trueLabel, VIEWBOX_WIDTH, PAD)}
                        y={TRUE_LABEL_Y}
                        textAnchor="middle"
                        fill={INK_STRONG}
                        fontSize="12"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                        {trueLabel}
                    </text>
                </g>

                {SIDES.map((side, sideIndex) => {
                    const indices = handfuls[sideIndex];
                    const chosen = new Set(indices);
                    const isActive = highlight === side.key;
                    const meanX = xOfTime(means[sideIndex] || TRUE_MEAN);
                    const meanLabel = `${side.name}'s average ${formatTime(means[sideIndex])}`;
                    return (
                        <g
                            key={side.key}
                            opacity={dim(side.key)}
                            style={{ transition: "opacity 150ms ease-out" }}
                        >
                            <text
                                x={PAD}
                                y={side.bandTop + BAND_HEIGHT / 2 + 4}
                                fill={side.color}
                                fontSize="12"
                            >
                                {side.name}
                            </text>

                            {/* every runner in the school */}
                            {RUNNERS.map((runner, index) =>
                                chosen.has(index) ? null : (
                                    <circle
                                        key={index}
                                        cx={xOfTime(runner.time)}
                                        cy={yInBand(runner.jitter, side.bandTop)}
                                        r={2.4}
                                        fill={POPULATION_COLOR}
                                        opacity={0.6}
                                    />
                                ),
                            )}

                            {/* this student's five, each one draggable */}
                            <g {...hoverProps(side.key)}>
                                {indices.map((index, slot) => {
                                    const cx = xOfTime(RUNNERS[index].time);
                                    const cy = yInBand(RUNNERS[index].jitter, side.bandTop);
                                    const held = dragging?.side === sideIndex && dragging?.slot === slot;
                                    return (
                                        <g key={slot}>
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={held || isActive ? 7.5 : 6}
                                                fill={side.color}
                                                filter="url(#duel-handle-shadow)"
                                                style={{ transition: "r 150ms ease-out" }}
                                            />
                                            <circle
                                                cx={cx}
                                                cy={cy}
                                                r={14}
                                                fill="transparent"
                                                style={{
                                                    cursor: held ? "grabbing" : "grab",
                                                    touchAction: "none",
                                                }}
                                                onPointerDown={(event) => {
                                                    event.currentTarget.setPointerCapture(event.pointerId);
                                                    setDragging({ side: sideIndex, slot });
                                                }}
                                                onPointerMove={(event) => {
                                                    if (dragging?.side === sideIndex && dragging?.slot === slot) {
                                                        snapToNearest(sideIndex, slot, event.clientX, event.clientY);
                                                    }
                                                }}
                                                onPointerUp={() => setDragging(null)}
                                                onPointerCancel={() => setDragging(null)}
                                            />
                                        </g>
                                    );
                                })}
                            </g>

                            {/* this handful's average, projected onto the shared axis */}
                            {ready && (
                                <g {...hoverProps(side.key)}>
                                    <line
                                        x1={meanX}
                                        y1={side.meanY}
                                        x2={meanX}
                                        y2={AXIS_Y}
                                        stroke={side.color}
                                        strokeWidth="1.5"
                                        strokeDasharray="3 5"
                                        opacity={0.7}
                                    />
                                    <circle cx={meanX} cy={side.meanY} r={isActive ? 9 : 7.5} fill={side.color} />
                                    <text
                                        x={clampLabelX(meanX, meanLabel, VIEWBOX_WIDTH, PAD)}
                                        y={side.labelY}
                                        textAnchor="middle"
                                        fill={side.color}
                                        fontSize="12"
                                        style={{ fontVariantNumeric: "tabular-nums" }}
                                    >
                                        {meanLabel}
                                    </text>
                                </g>
                            )}
                        </g>
                    );
                })}

                {/* the one axis both averages are read against */}
                <g opacity={dim("axis")} style={{ transition: "opacity 150ms ease-out" }}>
                    <line
                        x1={AXIS_LEFT}
                        y1={AXIS_Y}
                        x2={AXIS_RIGHT}
                        y2={AXIS_Y}
                        stroke={INK}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                    />
                    {TICKS.map((tick) => (
                        <g key={tick}>
                            <line
                                x1={xOfTime(tick)}
                                y1={AXIS_Y}
                                x2={xOfTime(tick)}
                                y2={AXIS_Y + 6}
                                stroke={INK}
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                            <text
                                x={xOfTime(tick)}
                                y={TICK_LABEL_Y}
                                textAnchor="middle"
                                fill={INK}
                                fontSize="11"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {tick}
                            </text>
                        </g>
                    ))}
                    <text x={VIEWBOX_WIDTH - PAD} y={TICK_LABEL_Y} textAnchor="end" fill={INK} fontSize="11">
                        seconds
                    </text>
                </g>

                <defs>
                    <filter id="duel-handle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
                    </filter>
                </defs>
            </svg>

            <div className="flex items-center justify-center gap-3 px-6 pb-5">
                <button
                    type="button"
                    onClick={() => {
                        dealFresh();
                        setVar("duelRedraws", redraws + 1);
                    }}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                    Give them both new handfuls
                </button>
            </div>

            <InteractionHintSequence
                hintKey="two-handfuls-drag"
                steps={[
                    {
                        gesture: "drag",
                        label: "Drag one of Amara's runners onto another runner",
                        position: { x: "45%", y: "24%" },
                        dragPath: { type: "line", startOffset: { x: -25, y: -12 }, endOffset: { x: 25, y: 12 } },
                    },
                ]}
            />
        </Figure>
    );
}
