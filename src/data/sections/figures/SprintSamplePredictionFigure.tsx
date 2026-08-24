import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Figure } from "@/components/molecules";
import { InteractionHintSequence } from "@/components/atoms";
import { useVar, useSetVar } from "@/stores";
import { clamp, useSpring } from "@/lib/motion";

/**
 * Sprint sample prediction figure
 * ==============================
 * Every runner in the school is a dot along a time line. The student drags the
 * teal marker to where they think the next handful of five will average, then
 * draws the handful: the five runners light up and their average drops onto the
 * row below, leaving every earlier average behind as a faint mark.
 */

const VIEWBOX_WIDTH = 640;
const VIEWBOX_HEIGHT = 300;
const PAD = 32;

const AXIS_LEFT = 70;
const AXIS_RIGHT = 580;
const TIME_MIN = 12.5;
const TIME_MAX = 18.5;

const BAND_TOP = 62;
const BAND_HEIGHT = 84;
const AXIS_Y = 178;
const TICK_LABEL_Y = 197;
const MEAN_Y = 230;
const MEAN_LABEL_Y = 253;
const TRUE_LABEL_Y = 281;
const HANDLE_Y = 50;
const PREDICTION_LABEL_Y = 33;

const TRUE_MEAN = 15.2;
const RUNNER_COUNT = 200;
const HANDFUL_SIZE = 5;

const INK = "#64748B";
const INK_STRONG = "#475569";
const POPULATION_COLOR = "#94A3B8";
const ACCENT = "#62D0AD";
const PARTNER = "#8E90F5";

const xOfTime = (time: number) =>
    AXIS_LEFT + ((time - TIME_MIN) / (TIME_MAX - TIME_MIN)) * (AXIS_RIGHT - AXIS_LEFT);

const timeOfX = (x: number) =>
    TIME_MIN + ((x - AXIS_LEFT) / (AXIS_RIGHT - AXIS_LEFT)) * (TIME_MAX - TIME_MIN);

const formatTime = (value: number) => `${value.toFixed(1)} s`;

/** Keep a centred label fully inside the viewBox (text ~ chars x size x 0.6). */
const clampLabel = (x: number, text: string, fontSize = 12) => {
    const half = (text.length * fontSize * 0.6) / 2;
    return clamp(x, PAD + half, VIEWBOX_WIDTH - PAD - half);
};

/** Deterministic population so every student sees the same school. */
const mulberry32 = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildPopulation = () => {
    const random = mulberry32(20240824);
    const times: number[] = [];
    const jitter: number[] = [];
    for (let i = 0; i < RUNNER_COUNT; i += 1) {
        const bell = (random() + random() + random() + random()) / 4 - 0.5;
        times.push(clamp(TRUE_MEAN + bell * 6.6, 12.9, 18.2));
        jitter.push(random());
    }
    const mean = times.reduce((sum, t) => sum + t, 0) / RUNNER_COUNT;
    const shift = TRUE_MEAN - mean;
    return times.map((time, index) => ({
        time: time + shift,
        y: BAND_TOP + jitter[index] * BAND_HEIGHT,
    }));
};

const POPULATION = buildPopulation();
const TICKS = [13, 14, 15, 16, 17, 18];

export function SprintSamplePredictionFigure() {
    const setVar = useSetVar();
    const prediction = useVar<number>("sprintPrediction", 16);
    const drawCount = useVar<number>("sprintDrawCount", 0);
    const lastMean = useVar<number>("sprintLastMean", 0);
    const highlight = useVar<string>("sprintHighlight", "");

    const [history, setHistory] = useState<number[]>([]);
    const [sampled, setSampled] = useState<number[]>([]);
    const [dragging, setDragging] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [moved, setMoved] = useState(false);
    const svgRef = useRef<SVGSVGElement>(null);

    // A reset (from the chrome, or from a feedback hint) zeroes the counter.
    useEffect(() => {
        if (drawCount === 0) {
            setHistory([]);
            setSampled([]);
        }
    }, [drawCount]);

    const sampledSet = useMemo(() => new Set(sampled), [sampled]);

    const handleScale = useSpring(dragging || hovered ? 1.15 : 1, { stiffness: 400, damping: 26 });
    const meanX = useSpring(xOfTime(lastMean > 0 ? lastMean : TRUE_MEAN), {
        stiffness: 180, damping: 22,
    });

    const predictionX = xOfTime(prediction);
    const trueX = xOfTime(TRUE_MEAN);
    const revealed = drawCount > 0;

    const movePrediction = useCallback(
        (clientX: number) => {
            if (!svgRef.current) return;
            const rect = svgRef.current.getBoundingClientRect();
            const x = ((clientX - rect.left) / rect.width) * VIEWBOX_WIDTH;
            const time = clamp(timeOfX(x), 12.6, 18.4);
            setVar("sprintPrediction", Math.round(time * 10) / 10);
            setMoved(true);
        },
        [setVar],
    );

    const drawHandful = useCallback(() => {
        const picked: number[] = [];
        while (picked.length < HANDFUL_SIZE) {
            const index = Math.floor(Math.random() * RUNNER_COUNT);
            if (!picked.includes(index)) picked.push(index);
        }
        const mean =
            Math.round((picked.reduce((sum, i) => sum + POPULATION[i].time, 0) / HANDFUL_SIZE) * 10) / 10;
        setSampled(picked);
        setHistory((previous) => [...previous, mean]);
        setVar("sprintLastMean", mean);
        setVar("sprintDrawCount", drawCount + 1);
    }, [drawCount, setVar]);

    const handleReset = useCallback(() => {
        setVar("sprintDrawCount", 0);
        setVar("sprintLastMean", 0);
        setVar("sprintPrediction", 16);
        setMoved(false);
    }, [setVar]);

    const dim = (id: string) => (highlight && highlight !== id ? 0.35 : 1);
    const trueActive = highlight === "trueAverage";
    const sampleActive = highlight === "sample";

    const predictionLabel = `your guess ${formatTime(prediction)}`;
    const meanLabel = `this handful ${formatTime(lastMean)}`;
    const trueLabel = `school average ${formatTime(TRUE_MEAN)}`;
    const gapLabel = revealed
        ? `off by ${Math.abs(lastMean - TRUE_MEAN).toFixed(1)} s`
        : "no handful drawn yet";

    const hoverProps = (id: string) => ({
        onPointerEnter: () => setVar("sprintHighlight", id),
        onPointerLeave: () => setVar("sprintHighlight", ""),
    });

    return (
        <Figure
            id="sprint-sample-prediction"
            onReset={handleReset}
            caption="Every grey dot is one runner. Drag the teal marker to your guess, then draw a handful of five and watch where its average lands."
        >
            <svg
                ref={svgRef}
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                className="block w-full"
                role="img"
                aria-label="Two hundred sprint times with a draggable prediction marker and the averages of drawn handfuls"
            >
                <text x={PAD} y={18} fill={INK} fontSize="12">
                    200 runners, 100 m
                </text>
                <text
                    x={VIEWBOX_WIDTH - PAD}
                    y={18}
                    textAnchor="end"
                    fill={revealed ? PARTNER : INK}
                    fontSize="12"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                >
                    {gapLabel}
                </text>

                {/* population: every runner, unchanged by anything the student does */}
                <g opacity={dim("population")} style={{ transition: "opacity 150ms ease-out" }}>
                    {POPULATION.map((runner, index) =>
                        sampledSet.has(index) ? null : (
                            <circle
                                key={index}
                                cx={xOfTime(runner.time)}
                                cy={runner.y}
                                r={2.6}
                                fill={POPULATION_COLOR}
                                opacity={0.65}
                            />
                        ),
                    )}
                </g>

                {/* axis */}
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

                {/* the school's true average, revealed once a handful has been drawn */}
                {revealed && (
                    <g
                        opacity={dim("trueAverage")}
                        style={{ transition: "opacity 150ms ease-out", cursor: "default" }}
                        {...hoverProps("trueAverage")}
                    >
                        {trueActive && (
                            <line
                                x1={trueX}
                                y1={56}
                                x2={trueX}
                                y2={MEAN_Y + 14}
                                stroke={INK_STRONG}
                                strokeWidth="9"
                                opacity={0.28}
                                strokeLinecap="round"
                            />
                        )}
                        <line
                            x1={trueX}
                            y1={56}
                            x2={trueX}
                            y2={MEAN_Y + 14}
                            stroke={INK_STRONG}
                            strokeWidth={trueActive ? 3.5 : 2}
                            strokeDasharray="6 6"
                            strokeLinecap="round"
                            style={{ transition: "stroke-width 150ms ease-out" }}
                        />
                        <text
                            x={clampLabel(trueX, trueLabel)}
                            y={TRUE_LABEL_Y}
                            textAnchor="middle"
                            fill={INK_STRONG}
                            fontSize="12"
                            style={{ fontVariantNumeric: "tabular-nums" }}
                        >
                            {trueLabel}
                        </text>
                    </g>
                )}

                {/* the handful and its average */}
                <g
                    opacity={dim("sample")}
                    style={{ transition: "opacity 150ms ease-out" }}
                    {...hoverProps("sample")}
                >
                    {history.slice(0, -1).map((mean, index) => (
                        <circle
                            key={`${mean}-${index}`}
                            cx={xOfTime(mean)}
                            cy={MEAN_Y}
                            r={4}
                            fill={PARTNER}
                            opacity={0.28}
                        />
                    ))}
                    {sampled.map((index) => (
                        <circle
                            key={`sampled-${index}`}
                            cx={xOfTime(POPULATION[index].time)}
                            cy={POPULATION[index].y}
                            r={sampleActive ? 6 : 4.6}
                            fill={PARTNER}
                            style={{ transition: "r 150ms ease-out" }}
                        />
                    ))}
                    {revealed && (
                        <>
                            <circle
                                cx={meanX}
                                cy={MEAN_Y}
                                r={sampleActive ? 10 : 8}
                                fill={PARTNER}
                                style={{ transition: "r 150ms ease-out" }}
                            />
                            <text
                                x={clampLabel(meanX, meanLabel)}
                                y={MEAN_LABEL_Y}
                                textAnchor="middle"
                                fill={PARTNER}
                                fontSize="12"
                                style={{ fontVariantNumeric: "tabular-nums" }}
                            >
                                {meanLabel}
                            </text>
                        </>
                    )}
                </g>

                {/* the student's prediction — the one thing they control */}
                <g opacity={dim("prediction")} style={{ transition: "opacity 150ms ease-out" }}>
                    <line
                        x1={predictionX}
                        y1={HANDLE_Y + 11}
                        x2={predictionX}
                        y2={AXIS_Y}
                        stroke={ACCENT}
                        strokeWidth="3"
                        strokeLinecap="round"
                    />
                    <text
                        x={clampLabel(predictionX, predictionLabel)}
                        y={PREDICTION_LABEL_Y}
                        textAnchor="middle"
                        fill={ACCENT}
                        fontSize="12"
                        style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                        {predictionLabel}
                    </text>
                    <g transform={`translate(${predictionX} ${HANDLE_Y}) scale(${handleScale})`}>
                        <circle r="11" fill={ACCENT} filter="url(#sprint-handle-shadow)" />
                    </g>
                    <line
                        x1={predictionX}
                        y1={HANDLE_Y}
                        x2={predictionX}
                        y2={AXIS_Y}
                        stroke="transparent"
                        strokeWidth="26"
                        style={{ cursor: dragging ? "grabbing" : "grab", touchAction: "none" }}
                        onPointerDown={(event) => {
                            event.currentTarget.setPointerCapture(event.pointerId);
                            setDragging(true);
                            movePrediction(event.clientX);
                        }}
                        onPointerMove={(event) => {
                            if (dragging) movePrediction(event.clientX);
                        }}
                        onPointerUp={() => setDragging(false)}
                        onPointerCancel={() => setDragging(false)}
                        onPointerEnter={() => setHovered(true)}
                        onPointerLeave={() => setHovered(false)}
                    />
                </g>

                <defs>
                    <filter id="sprint-handle-shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#0F172A" floodOpacity="0.25" />
                    </filter>
                </defs>
            </svg>

            <div className="flex items-center justify-center gap-3 px-6 pb-5">
                <button
                    type="button"
                    onClick={drawHandful}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                >
                    Draw five runners
                </button>
                <span className="text-xs text-slate-500" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {drawCount === 1 ? "1 handful drawn" : `${drawCount} handfuls drawn`}
                </span>
            </div>

            <InteractionHintSequence
                hintKey="sprint-sample-prediction"
                currentStep={moved ? 1 : 0}
                steps={[
                    {
                        gesture: "drag-horizontal",
                        label: "Drag the teal marker to your guess",
                        position: { x: "57%", y: "17%" },
                        dragPath: { type: "line", startOffset: { x: -30, y: 0 }, endOffset: { x: 30, y: 0 } },
                    },
                    {
                        gesture: "click",
                        label: "Now draw five runners",
                        position: { x: "44%", y: "90%" },
                    },
                ]}
            />
        </Figure>
    );
}
