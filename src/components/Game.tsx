import { createEffect, createSignal, on, onCleanup } from 'solid-js'
import { state, type Problem } from '../data'
import './Game.scss'
import { VsCheck, VsChromeClose, VsRefresh } from 'solid-icons/vs'
import { ScoreCard } from '.'

function initialProblems(): Problem[] {
  // return [forN(2)(1), forN(2)(2)]
  const map = {
    // 2: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    // 3: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    // 4: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    // 5: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    6: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    7: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    8: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  } as const

  const items = Object.entries(map)
    .map(([key, values]) =>
      values.map((v) => [Number(key), v] as [number, number]),
    )
    .flat()

  const result: Problem[] = []

  while (items.length) {
    const j = Math.floor(Math.random() * items.length)
    const [n, i] = items.splice(j, 1)[0]

    result.push({
      type: 'multiplication' as 'multiplication',
      weight: 1,
      m1: n,
      m2: i,
      p: n * i,
    })
  }

  return result

  // function forN(n: number) {
  //   return (i: number) => {
  //     return {
  //       type: 'multiplication' as 'multiplication',
  //       weight: 1,
  //       m1: n,
  //       m2: i,
  //       p: n * i,
  //     }
  //   }
  // }

  // return [...map['2'].map(forN(2)), ...map['3'].map(forN(3))]
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

  // const onRetry = () => {
  //   state.retry()
  //   setAnswer('')
  //   rerun()
  //   onNext()
  // }

  const onNext = () => {
    state.markComplete()
    setAnswer('')
    rerun()
  }

  createEffect(
    on(depend, () => {
      inputRef?.focus()

      if (state.autoProgress && state.status !== 'unanswered') {
        const timeout = setTimeout(() => {
          // onNext()
          document.querySelector<HTMLButtonElement>('button.round')?.click()
        }, 1500)

        onCleanup(() => clearTimeout(timeout))
      }
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
            {state.status !== 'unanswered' && (
              <button class={`round ${state.status}`} onClick={onNext}>
                {state.status === 'correct' ? (
                  <VsCheck size={48} />
                ) : (
                  <VsChromeClose size={48} />
                )}
              </button>
            )}
          </>
        )}
        {state.current == null && (
          <>
            {state.rounds.length ? <ScoreCard /> : null}
            <button class="play" onClick={onReset}>
              {state.rounds.length ? (
                <>
                  Play Again
                  <VsRefresh size={20} />
                </>
              ) : (
                'Play'
              )}
            </button>
          </>
        )}
        <span class="status">
          {state.status !== 'unanswered' && state.status}
        </span>
        <span class="status-icon">{state.statusIcon}</span>
        {state.current && (
          <>
            <ScoreCard />
            <footer class="footer">
              <span>High Score {state.highScore}</span>
              <button class="refresh" onClick={onReset}>
                <VsRefresh size={20} />
              </button>
            </footer>
          </>
        )}
      </div>
    </form>
  )
}
