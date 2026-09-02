import { useCallback, useEffect, useRef, useState } from "react";
import { Figure } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";
import { clamp, useRafLoop, useSpring } from "@/lib/motion";
import { TRUE_MEAN, drawHandfulIndices, handfulMean } from "./sprintPopulation";
import { ACCENT, INK, INK_STRONG, PARTNER, clampLabelX, formatTime } from "./figureStyle";

/**
 * Average pour figure
 * ===================
 * A sampler full of runners sits above a row of empty quarter-second columns.
 * Tipping the sampler releases handfuls of five: each handful's average falls
 * into the column it belongs to and makes that column one block taller, so the
 * pile of averages builds itself in front of the student.
 */

const VIEWBOX_WIDTH = 640;
const VIEWBOX_HEIGHT = 360;
const PAD = 32;

const CHART_LEFT = 64;
const CHART_RIGHT = 596;
const BASELINE_Y = 306;
const STACK_TOP_Y = 118;
const COLUMN_GAP = 6;

const BIN_WIDTH = 0.25;
const BIN_MIN = 13.7;
const BIN_COUNT = 12;
const BIN_MAX = BIN_MIN + BIN_WIDTH * BIN_COUNT;

const SAMPLER_X = 320;
const SAMPLER_Y = 58;
const SAMPLER_MOUTH_Y = 80;

const HANDFUL_SIZE = 5;
const MAX_POURED = 300;
const FALL_SECONDS = 0.42;

const COLUMN_PITCH = (CHART_RIGHT - CHART_LEFT) / BIN_COUNT;
const COLUMN_WIDTH = COLUMN_PITCH - COLUMN_GAP;
const MIDDLE_BINS = [5, 6, 7];
const TICKS = [14, 14.5, 15, 15.5, 16, 16.5];

const xOfTime = (time: number) =>
    CHART_LEFT + ((time - BIN_MIN) / (BIN_MAX - BIN_MIN)) * (CHART_RIGHT - CHART_LEFT);

const binOfMean = (mean: number) =>
    clamp(Math.floor((mean - BIN_MIN) / BIN_WIDTH), 0, BIN_COUNT - 1);

const columnX = (bin: number) => CHART_LEFT + bin * COLUMN_PITCH + COLUMN_GAP / 2;

const blockHeightFor = (tallest: number) =>
    clamp((BASELINE_Y - STACK_TOP_Y) / Math.max(tallest, 1), 1.6, 11);

interface FallingAverage {
    id: number;
    mean: number;
    bin: number;
    landsAt: number;
    progress: number;
}

export function AveragePourFigure() {
    const setVar = useSetVar();
    const tilt = useVar<number>("stackTilt", 0);
    const poured = useVar<number>("stackPoured", 0);
    const highlight = useVar<string>("stackHighlight", "");

    const [dragging, setDragging] = useState(false);
    const [counts, setCounts] = useState<number[]>(() => new Array(BIN_COUNT).fill(0));
    const [falling, setFalling] = useState<FallingAverage[]>([]);
    const svgRef = useRef<SVGSVGElement>(null);
    const tiltRef = useRef(tilt);
    const accumulatorRef = useRef(0);
    const nextIdRef = useRef(0);
    const totalRef = useRef(0);
    const landedRef = useRef(0);

    tiltRef.current = tilt;

    // A reset (chrome button, or a feedback hint) empties the columns.
    useEffect(() => {
        if (poured === 0) {
            totalRef.current = 0;
            landedRef.current = 0;
            accumulatorRef.current = 0;
            setCounts(new Array(BIN_COUNT).fill(0));
            setFalling([]);
        }
    }, [poured]);

    const pouring = tilt > 4 && totalRef.current < MAX_POURED;
    const active = pouring || falling.length > 0;

    useRafLoop(
        (dt) => {
            const rate = Math.pow(clamp(tiltRef.current / 70, 0, 1), 1.4) * 13;
            const spawned: FallingAverage[] = [];
            if (tiltRef.current > 4 && totalRef.current < MAX_POURED) {
                accumulatorRef.current += rate * dt;
                while (accumulatorRef.current >= 1 && totalRef.current < MAX_POURED) {
                    accumulatorRef.current -= 1;
                    totalRef.current += 1;
                    const mean = handfulMean(drawHandfulIndices(HANDFUL_SIZE));
                    const bin = binOfMean(mean);
                    nextIdRef.current += 1;
                    spawned.push({ id: nextIdRef.current, mean, bin, landsAt: 0, progress: 0 });
                }
            }

            const landedBins: number[] = [];
            setFalling((previous) => {
                const next: FallingAverage[] = [];
                for (const item of [...previous, ...spawned]) {
                    const progress = item.progress + dt / FALL_SECONDS;
                    if (progress >= 1) landedBins.push(item.bin);
                    else next.push({ ...item, progress });
                }
                return next;
            });

            if (landedBins.length > 0) {
                setCounts((previous) => {
                    const next = [...previous];
                    for (const bin of landedBins) next[bin] += 1;
                    return next;
                });
                landedRef.current += landedBins.length;
                setVar("stackPoured", landedRef.current);
            }
        },
        { paused: !active },
    );

    const landedTotal = counts.reduce((sum, count) => sum + count, 0);

    const shownTiltSpring = useSpring(tilt, { stiffness: 320, damping: 26 });
    const shownTilt = dragging ? tilt : shownTiltSpring;
    const handleScale = useSpring(dragging ? 1.12 : 1, { stiffness: 400, damping: 26 });

    const moveTilt = useCallback(
        (clientX: number) => {
            if (!svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const x = ((clientX - rect.left) / rect.width) * VIEWBOX_WIDTH;
            setVar("stackTilt", Math.round(clamp((x - SAMPLER_X) / 2.6, 0, 70)));
        },
        [setVar],
    );

    const releaseTilt = useCallback(() => {
        setDragging(false);
        setVar("stackTilt", 0);
    }, [setVar]);

    const handleReset = useCallback(() => {
        setVar("stackTilt", 0);
        setVar("stackPoured", 0);
    }, [setVar]);

    const tallest = Math.max(1, ...counts);
    const blockHeight = blockHeightFor(tallest);
    const blockGap = blockHeight > 4.5 ? 1 : 0;

    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const trueActive = highlight === "trueAverage";
    const middleActive = highlight === "middle";
    const samplerActive = highlight === "sampler";
    const trueX = xOfTime(TRUE_MEAN);
    const trueLabel = `school average ${formatTime(TRUE_MEAN)}`;

    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("stackHighlight", id),
        onPointerLeave: () => setVar("stackHighlight", ""),
    });

    return (
        <Figure
            id="average-pour"
            onReset={handleReset}
            caption="Drag the sampler to the right to tip it: a small tilt trickles handfuls out one at a time, a big tilt pours a stream. Each average lands in the column it belongs to."
        >
            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="block w-full"
                role="img"
                aria-label="A tiltable sampler pouring handful averages into quarter-second columns"
            >
                <text x={PAD} y={20} fill={INK} fontSize="12">
                    each handful: 5 runners
                </text>
                <text
                    x={VIEWBOX_WIDTH - PAD}
                    y={20}
                    textAnchor="end"
                    fill={PARTNER}
                    fontSize="12"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {landedTotal === 1 ? "1 average in the pile" : `${landedTotal} averages in the pile`}
                </text>

                {/* the school's true average, as a quiet reference through the pile */}
                <g
                    opacity={dim("trueAverage")}
                    style={{ transition: "opacity 150ms ease-out" }}
                    {...hoverProps("trueAverage")}
                >
                    {trueActive && (
                        <line
                            x1={trueX}
                            y1={112}
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
                        y1={112}
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
                        y={344}
                        textAnchor="middle"
                        fill={INK_STRONG}
                        fontSize="12"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                        {trueLabel}
                    </text>
                </g>

                {/* the pile of averages, one block per handful */}
                <g style={{ transition: "opacity 150ms ease-out" }}>
                    {counts.map((count, bin) => {
                        const isMiddle = MIDDLE_BINS.includes(bin);
                        const columnDim = highlight
                            ? middleActive
                                ? isMiddle
                                    ? 1
                                    : 0.35
                                : 0.35
                            : 1;
                        return (
                            <g
                                key={bin}
                                opacity={columnDim}
                                style={{ transition: "opacity 150ms ease-out" }}
                                {...(isMiddle ? hoverProps("middle") : {})}
                            >
                                {middleActive && isMiddle && count > 0 && (
                                    <rect
                                        x={columnX(bin) - 3}
                                        y={BASELINE_Y - count * blockHeight - 3}
                                        width={COLUMN_WIDTH + 6}
                                        height={count * blockHeight + 3}
                                        rx="4"
                                        fill={PARTNER}
                                        opacity={0.28}
                                    />
                                )}
                                {Array.from({ length: count }, (_, level) => (
                                    <rect
                                        key={level}
                                        x={columnX(bin)}
                                        y={BASELINE_Y - (level + 1) * blockHeight}
                                        width={COLUMN_WIDTH}
                                        height={Math.max(blockHeight - blockGap, 1.2)}
                                        rx={blockHeight > 5 ? 2 : 1}
                                        fill={PARTNER}
                                        opacity={0.85}
                                    />
                                ))}
                            </g>
                        );
                    })}
                </g>

                {/* averages still on their way down */}
                <g opacity={dim("falling")} style={{ transition: "opacity 150ms ease-out" }}>
                    {falling.map((item) => {
                        const targetX = columnX(item.bin) + COLUMN_WIDTH / 2;
                        const targetY = BASELINE_Y - counts[item.bin] * blockHeight - 5;
                        const x = SAMPLER_X + (targetX - SAMPLER_X) * item.progress;
                        const y =
                            SAMPLER_MOUTH_Y + (targetY - SAMPLER_MOUTH_Y) * (item.progress * item.progress);
                        return <circle key={item.id} cx={x} cy={y} r={4.5} fill={PARTNER} opacity={0.9} />;
                    })}
                </g>

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
                    <text x={VIEWBOX_WIDTH - PAD} y={344} textAnchor="end" fill={INK} fontSize="11">
                        seconds
                    </text>
                </g>

                {/* the sampler: the one thing the student controls */}
                <g opacity={dim("sampler")} style={{ transition: "opacity 150ms ease-out" }}>
                    <g transform={`translate(${SAMPLER_X} ${SAMPLER_Y}) rotate(${shownTilt})`}
                        {...hoverProps("sampler")}
                    >
                        <g transform={`scale(${handleScale})`}>
                            {samplerActive && (
                                <path
                                    d="M -38 -20 L 38 -20 L 26 18 L -26 18 Z"
                                    fill="none"
                                    stroke={ACCENT}
                                    strokeWidth="10"
                                    opacity={0.28}
                                    strokeLinejoin="round"
                                />
                            )}
                            <path
                                d="M -38 -20 L 38 -20 L 26 18 L -26 18 Z"
                                fill="#FFFFFF"
                                stroke={ACCENT}
                                strokeWidth={samplerActive ? 5 : 3.5}
                                strokeLinejoin="round"
                                filter="url(#pour-handle-shadow)"
                                style={{ transition: "stroke-width 150ms ease-out" }}
                            />
                            {[-18, -6, 6, 18].map((offset) => (
                                <circle key={offset} cx={offset} cy={2} r={4} fill={PARTNER} opacity={0.85} />
                            ))}
                            <circle cx={0} cy={-10} r={4} fill={PARTNER} opacity={0.85} />
                        </g>
                        <rect
                            x={-46}
                            y={-30}
                            width={92}
                            height={58}
                            fill="transparent"
                            style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
                            onPointerDown={(event) => {
                                event.currentTarget.setPointerCapture(event.pointerId);
                                setDragging(true);
                                moveTilt(event.clientX);
                            }}
                            onPointerMove={(event) => {
                                if (dragging) moveTilt(event.clientX);
                            }}
                            onPointerUp={releaseTilt}
                            onPointerCancel={releaseTilt}
                        />
                    </g>
                </g>

                <defs>
                    <filter id="pour-handle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
                    </filter>
                </defs>
            </svg>

            <InteractionHintSequence
                hintKey="average-pour-tilt"
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the sampler to the right to tip it over",
                        position: { x: "50%", y: "16%" },
                        dragPath: { type: "line", startOffset: { x: -10, y: 0 }, endOffset: { x: 40, y: 0 } },
                    },
                ]}
            />
        </Figure>
    );
}
