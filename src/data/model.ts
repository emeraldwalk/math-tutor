export interface MultiplicationProblem {
  type: 'multiplication'
  weight: number
  m1: number
  m2: number
  p: number
}

export type Problem = MultiplicationProblem

export interface Round {
  correct: number
  incorrect: number
  score: number
  remaining: Problem[]
}
