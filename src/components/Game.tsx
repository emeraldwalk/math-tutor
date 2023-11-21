import { createEffect, createSignal, on } from 'solid-js'
import { state, type Problem, setState } from '../data'
import './Game.scss'
import { VsCheck, VsChromeClose, VsRefresh } from 'solid-icons/vs'

function initialProblems(): Problem[] {
  const map = {
    2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  } as const

  function forN(n: number) {
    return (i: number) => {
      return {
        type: 'multiplication' as 'multiplication',
        m1: n,
        m2: i,
        p: n * i,
      }
    }
  }

  return [...map['2'].map(forN(2)), ...map['3'].map(forN(3))]
}

export function Game() {
  let inputRef: HTMLInputElement | undefined
  const [depend, rerun] = createSignal(undefined, { equals: false })
  const [answer, setAnswer] = createSignal('')

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault()
    state.checkAnswer(Number(inputRef?.value))
    rerun()
  }

  const onReset = () => {
    state.reset(initialProblems())
    rerun()
  }

  const onRetry = () => {
    setAnswer('')
    state.retry()
    rerun()
  }

  const onNext = () => {
    state.markComplete()
    setAnswer('')
    rerun()
  }

  createEffect(
    on(depend, () => {
      inputRef?.focus()
    }),
  )

  return (
    <form class="game" onSubmit={onSubmit}>
      <div class="game-layout">
        {state.current != null && (
          <>
            <div class="question">
              {state.current.m1} x {state.current.m2}
            </div>
            <input
              class="answer"
              disabled={state.status !== 'unanswered'}
              ref={inputRef}
              type="number"
              inputmode="numeric"
              pattern="[0-9]*"
              value={answer()}
              onInput={(e) => setAnswer(e.currentTarget.value)}
            />
            {state.status === 'unanswered' && (
              <button
                class="round submit"
                type="submit"
                disabled={answer() === ''}>
                OK
              </button>
            )}
            {state.status === 'correct' && (
              <button class="round next" onClick={onNext}>
                <VsCheck size={48} />
              </button>
            )}
            {state.status === 'incorrect' && (
              <button class="round retry" onClick={onRetry}>
                <VsChromeClose size={48} />
              </button>
            )}
          </>
        )}
        {state.current == null && (
          <button class="play" onClick={onReset}>
            {state.correct.length || state.incorrect.length ? (
              <>
                Play Again
                <VsRefresh size={20} />
              </>
            ) : (
              'Play'
            )}
          </button>
        )}
        <span class="status">
          {state.status !== 'unanswered' && state.status}
        </span>
        <span class="status-icon">{state.statusIcon}</span>
        {state.current && (
          <footer class="scoreboard">
            <span>Round {state.rounds.length + 1}</span>
            Score {state.score[0]} / {state.score[1]}
          </footer>
        )}
      </div>
    </form>
  )
}
