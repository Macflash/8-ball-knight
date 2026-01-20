export enum TurnStage {
  inactive,
  aim,
  attack,
  resolve,
}

export function isAttacking({ turn }: { turn?: TurnStage }) {
  return turn == TurnStage.attack;
}

export function notAttacking({ turn }: { turn?: TurnStage }) {
  return turn !== TurnStage.attack;
}

export function isAiming({ turn }: { turn?: TurnStage }) {
  return turn == TurnStage.aim;
}
