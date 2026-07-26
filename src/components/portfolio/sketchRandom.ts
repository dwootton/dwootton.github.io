export type SeededRandom = () => number

export function hashStringToNumber(value: string): number {
  let hash = 2166136261

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

export function mulberry32(seed: number): SeededRandom {
  return () => {
    let next = seed += 0x6d2b79f5
    next = Math.imul(next ^ (next >>> 15), next | 1)
    next ^= next + Math.imul(next ^ (next >>> 7), next | 61)
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296
  }
}

export function createRng(seed: string): SeededRandom {
  return mulberry32(hashStringToNumber(seed))
}

export function randomBetween(rng: SeededRandom, min: number, max: number): number {
  return min + (max - min) * rng()
}

export function randomInt(rng: SeededRandom, min: number, max: number): number {
  return Math.floor(randomBetween(rng, min, max + 1))
}

export function pick<T>(rng: SeededRandom, values: readonly T[]): T {
  return values[Math.floor(rng() * values.length)]
}

export function chance(rng: SeededRandom, probability: number): boolean {
  return rng() < probability
}

export function jitter(value: number, amount: number, rng: SeededRandom): number {
  return value + (rng() - 0.5) * amount * 2
}
