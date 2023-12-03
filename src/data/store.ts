import { createStore } from 'solid-js/store'
import type { Problem, Round } from './model'

const emojiIncorrect = ['😔', '😳', '😫']
const emojiCorrect = ['😁', '🥳', '🥰']

const FULL_QUESTION_SCORE = 100
const LOCAL_STORAGE_SCORE_KEY = 'math-tutor.score'

export const [state, setState] = createStore({
  autoProgress: true,
  rounds: [] as Round[],
  roundI: 0,

  status: 'unanswered' as 'unanswered' | 'correct' | 'incorrect',

  get highScore(): number {
    return Number(localStorage.getItem(LOCAL_STORAGE_SCORE_KEY) || '0')
  },

  get currentRound(): Round | undefined {
    return this.rounds[this.roundI]
  },

  get remainingProblems(): Problem[] {
    return this.currentRound?.remaining ?? []
  },

  get currentProblem(): Problem | undefined {
    return this.remainingProblems[0]
  },

  get isGameStart(): boolean {
    return this.rounds.length === 0
  },

  get isGameOver(): boolean {
    return this.roundI === this.rounds.length - 1 && this.currentProblem == null
  },

  get isRoundActive(): boolean {
    return this.currentProblem != null
  },

  get score(): {
    answered: number
    missed: number
    total: number
    score: number
    remaining: number
  } {
    const round = this.currentRound
    if (round == null) {
      return { answered: 0, missed: 0, total: 0, score: 0, remaining: 0 }
    }

    const weight = this.currentProblem?.weight ?? 0

    return {
      answered: round.correct + (this.status === 'correct' ? 1 : 0),
      missed: round.incorrect + (this.status === 'incorrect' ? 1 : 0),
      total: round.correct + round.incorrect + 1,
      score:
        round.score +
        (this.status === 'correct' ? FULL_QUESTION_SCORE * weight : 0),
      remaining:
        this.remainingProblems.length + (this.status === 'correct' ? -1 : 0),
    }
  },

  get statusIcon(): string {
    switch (this.status) {
      case 'incorrect':
        return emojiIncorrect[Math.floor(Math.random() * emojiIncorrect.length)]

      case 'correct':
        return emojiCorrect[Math.floor(Math.random() * emojiCorrect.length)]

      default:
        return ''
    }
  },

  checkAnswer(answer: number): boolean {
    const problem = this.currentProblem

    if (problem == null) {
      return false
    }

    switch (problem.type) {
      case 'multiplication':
        const isCorrect = answer === problem.p
        setState('status', isCorrect ? 'correct' : 'incorrect')
        return isCorrect

      default:
        return false
    }
  },

  markComplete() {
    const current = this.currentProblem

    if (current == null) {
      return
    }

    const isCorrect = this.status === 'correct'

    setState('status', 'unanswered')

    // Update current round
    setState('rounds', this.roundI, (prev) => {
      if (isCorrect) {
        return {
          ...prev,
          correct: prev.correct + 1,
          score: prev.score + FULL_QUESTION_SCORE * current.weight,
        }
      }

      return { ...prev, incorrect: prev.incorrect + 1 }
    })

    // Update remaining problems in current round
    setState('rounds', this.roundI, 'remaining', (prev) => {
      const first = prev[0]

      // If answer is incorrect, remove first item and decrease the weight of last
      if (!isCorrect && first) {
        return [...prev.slice(1), { ...first, weight: first.weight / 2 }]
      }

      // Update without first item
      return prev.slice(1)
    })

    if (this.remainingProblems.length === 0) {
      const lastHighScore = this.highScore
      const highScore = this.rounds.at(-1)?.score ?? 0
      localStorage.setItem(
        LOCAL_STORAGE_SCORE_KEY,
        String(Math.max(highScore, lastHighScore)),
      )
    }
  },

  nextRound() {
    setState('roundI', (i) => i + 1)
  },

  reset(initialRounds: Round[]) {
    setState('rounds', initialRounds)
  },

  retry() {
    setState('status', 'unanswered')
  },
})
