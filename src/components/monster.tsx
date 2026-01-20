import { BallEl } from "./ball";
import { isAlive, isDead, isHurt } from "../game/types/hp";
import { isMoving } from "../game/physics/ball";
import { TurnStage } from "../game/types/turn";
import { StatusEl } from "./status";
import { Monster } from "../game/types/monster";

export function MonsterEl({ monster }: { monster: Monster }) {
  return (
    <BallEl
      ball={monster}
      id="game-cue"
      background={isAlive(monster) && monster.turn ? "red" : undefined}
    >
      <StatusEl {...monster} />
      <MonsterImage monster={monster} />
    </BallEl>
  );
}

function MonsterImage({ monster }: { monster: Monster }) {
  if (isDead(monster)) return null;

  const { images } = monster;
  let image = images.normal;
  if (isHurt(monster)) image = images.hurt;
  if (isMoving(monster)) image = images.surprised;
  if (monster.turn == TurnStage.attack) image = images.attack;

  return (
    <img
      style={{ marginTop: -0.1 * monster.r }}
      src={image}
      height={monster.r * 2.5}
    ></img>
  );
}
