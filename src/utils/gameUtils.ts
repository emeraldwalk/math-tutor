import type { MultiplicationProblem, Problem, Round } from '../data'

const TEST_MAP = {
  2: [1, 2, 3],
  3: [1, 2, 3],
  4: [1, 2, 3],
  5: [1, 2, 3],
  6: [1, 2, 3],
  7: [1, 2, 3],
  8: [1, 2, 3],
}

const MAP = {
  2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
  3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  5: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  6: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  7: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  8: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  9: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  10: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  11: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  12: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
} as const

type MapKey = keyof typeof MAP

export interface RoundConfig<TInit> {
  factory: (init: TInit) => void
  init: TInit
}

export function initRounds(): Round[] {
  return [
    initMultiplicationProblems([2]),
    initMultiplicationProblems([3, 4, 5]),
    initMultiplicationProblems([6, 7, 8]),
  ].map((remaining) => ({
    correct: 0,
    incorrect: 0,
    score: 0,
    remaining,
  }))
}

export function initMultiplicationProblems(
  ns: MapKey[],
): MultiplicationProblem[] {
  const items = ns
    .map((n) => MAP[n].map((v) => [n, v] as [number, number]))
    .flat()

  const result: Problem[] = []

  for (const [n, i] of randomizeItems(items)) {
    result.push({
      type: 'multiplication' as 'multiplication',
      weight: 1,
      m1: n,
      m2: i,
      p: n * i,
    })
  }

  return result
}

function* randomizeItems<T>(items: T[]) {
  while (items.length) {
    const j = Math.floor(Math.random() * items.length)
    yield items.splice(j, 1)[0]
  }
}
