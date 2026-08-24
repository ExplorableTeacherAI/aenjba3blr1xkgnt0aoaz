/**
 * The school's 100 m times — one shared population for every figure in this
 * lesson, so a handful drawn in one section comes from exactly the same school
 * as a handful drawn in another.
 */

export const TRUE_MEAN = 15.2;
export const RUNNER_COUNT = 200;

export interface Runner {
    /** Time in seconds */
    time: number;
    /** Stable 0..1 offset so each figure can place the dot in its own band */
    jitter: number;
}

const clampNumber = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);

/** Deterministic generator so every student sees the same school. */
const mulberry32 = (seed: number) => () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const buildPopulation = (): Runner[] => {
    const random = mulberry32(20240824);
    const times: number[] = [];
    const jitters: number[] = [];
    for (let i = 0; i < RUNNER_COUNT; i += 1) {
        const bell = (random() + random() + random() + random()) / 4 - 0.5;
        times.push(clampNumber(TRUE_MEAN + bell * 6.6, 12.9, 18.2));
        jitters.push(random());
    }
    const mean = times.reduce((sum, time) => sum + time, 0) / RUNNER_COUNT;
    const shift = TRUE_MEAN - mean;
    return times.map((time, index) => ({ time: time + shift, jitter: jitters[index] }));
};

export const POPULATION: Runner[] = buildPopulation();

/** Indices of a random handful drawn without replacement. */
export const drawHandfulIndices = (size: number): number[] => {
    const picked: number[] = [];
    while (picked.length < size) {
        const index = Math.floor(Math.random() * RUNNER_COUNT);
        if (!picked.includes(index)) picked.push(index);
    }
    return picked;
};

/** Mean time of a handful, rounded to the tenth of a second the lesson uses. */
export const handfulMean = (indices: number[]): number =>
    Math.round((indices.reduce((sum, i) => sum + POPULATION[i].time, 0) / indices.length) * 100) / 100;
