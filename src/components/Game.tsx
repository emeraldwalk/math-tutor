import {
  Match,
  Switch,
  createEffect,
  createSignal,
  on,
  onCleanup,
} from 'solid-js'
import { state, type Problem } from '../data'
import './Game.scss'
import { VsCheck, VsChromeClose, VsRefresh } from 'solid-icons/vs'
import { ScoreCard } from '.'
import { initMultiplicationProblems, initRounds } from '../utils'

export function Game() {
  let inputRef: HTMLInputElement | undefined
  const [depend, rerun] = createSignal(undefined, { equals: false })
  const [answer, setAnswer] = createSignal('')

  const onCheckProblem = () => {
    state.checkAnswer(Number(inputRef?.value))
    rerun()
  }

  const onNextProblem = () => {
    state.markComplete()
    setAnswer('')
    rerun()
  }

  const onNextRound = () => {
    state.nextRound()
    rerun()
  }

  const onReset = () => {
    state.reset(initRounds())
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
    <form class="game">
      <div class="game-layout">
        {state.currentProblem != null && (
          <>
            <div class="question">
              {state.currentProblem.m1} x {state.currentProblem.m2}
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
            <button
              class={`round ${state.status}`}
              disabled={state.status === 'unanswered' && answer() === ''}
              onClick={
                state.status === 'unanswered' ? onCheckProblem : onNextProblem
              }>
              <Switch>
                <Match when={state.status === 'unanswered'}>OK</Match>
                <Match when={state.status === 'correct'}>
                  <VsCheck size={48} />
                </Match>
                <Match when={state.status === 'incorrect'}>
                  <VsChromeClose size={48} />
                </Match>
              </Switch>
            </button>
          </>
        )}
        {!state.isRoundActive && (
          <>
            {state.rounds.length ? <ScoreCard /> : null}
            <button
              class="play"
              onClick={
                state.isGameStart || state.isGameOver ? onReset : onNextRound
              }>
              <Switch>
                <Match when={state.isGameStart}>Play</Match>
                <Match when={state.isGameOver}>
                  <>
                    Play Again
                    <VsRefresh size={20} />
                  </>
                </Match>
                <Match when={!state.isGameStart && !state.isGameOver}>
                  <>
                    Next Round
                    {/* <VsRefresh size={20} /> */}
                  </>
                </Match>
              </Switch>
            </button>
          </>
        )}
        <span class="status">
          {state.status !== 'unanswered' && state.status}
        </span>
        <span class="status-icon">{state.statusIcon}</span>
        {state.currentProblem && (
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
