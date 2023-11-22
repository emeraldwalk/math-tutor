import { state } from '../data'
import styles from './ScoreCard.module.scss'

export function ScoreCard() {
  return (
    <div class={styles.scoreCard}>
      <span>Round {state.rounds.length}</span>
      <span>Score {state.score.score}</span>
      <span>Missed {state.score.missed}</span>
      <br />
      <span>High Score {state.highScore}</span>
    </div>
  )
}
