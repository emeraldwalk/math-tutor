import { state } from '../data'
import styles from './ScoreCard.module.scss'

export function ScoreCard() {
  return (
    <div class={styles.scoreCard}>
      <span>Round {state.roundI + 1}</span>
      <span>Score {state.score.score}</span>
      <span>Missed {state.score.missed}</span>
      <span>Remaining {state.score.remaining}</span>
      {/* <br /> */}
      {/* <span>High Score {state.highScore}</span> */}
    </div>
  )
}
