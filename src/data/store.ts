import { createStore } from 'solid-js/store'
import type { Problem, Round } from './model'

const emojiIncorrect = ['😔', '😳', '😫']
const emojiCorrect = ['😁', '🥳', '🥰']

export const [state, setState] = createStore({
  remaining: [] as Problem[],
  correct: [] as Problem[],
  incorrect: [] as Problem[],
  rounds: [] as Round[],

  status: 'unanswered' as 'unanswered' | 'correct' | 'incorrect',

  get current(): Problem | undefined {
    return this.remaining[0]
  },

  get score(): [number, number] {
    const offset = this.status === 'correct' ? 1 : 0
    return [
      this.correct.length + offset,
      this.correct.length + this.incorrect.length + 1,
    ]
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
    const problem = this.remaining[0]

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
    const current = this.remaining[0]

    if (current == null) {
      return
    }

    const isCorrect = this.status === 'correct'

    setState('status', 'unanswered')
    setState('remaining', (prev) => prev.slice(1))
    setState(isCorrect ? 'correct' : 'incorrect', (prev) => [...prev, current])
  },

  reset(initialProblems: Problem[]) {
    if (state.correct.length || state.incorrect.length) {
      setState('rounds', (rounds) => [
        ...rounds,
        { correct: this.correct.length, incorrect: this.incorrect.length },
      ])
    }

    setState('remaining', initialProblems)
    setState('correct', [])
    setState('incorrect', [])
  },

  retry() {
    setState('status', 'unanswered')
  },
})
