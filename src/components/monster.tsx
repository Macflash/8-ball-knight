import { BallEl } from "./ball";
import { isAlive, isDead, isHurt } from "../game/types/hp";
import { isMoving } from "../game/physics/ball";
import { TurnStage } from "../game/types/turn";
import { StatusEl } from "./status";
import { Monster } from "../game/types/monster";
import { ImageEl } from "./image";

export function MonsterEl({
  monster,
  lost,
}: {
  monster: Monster;
  lost?: boolean;
}) {
  return (
    <BallEl
      ball={monster}
      // background={isAlive(monster) ? "darkred" : undefined}
      glow={isAlive(monster) && monster.turn ? "red" : undefined}
    >
      {isAlive(monster) ? <StatusEl {...monster} /> : undefined}
      <MonsterImage monster={monster} lost={lost} />
    </BallEl>
  );
}

function MonsterImage({ monster, lost }: { monster: Monster; lost?: boolean }) {
  if (isDead(monster)) return null;

  const { images } = monster;
  let image = images.normal;
  if (isHurt(monster)) image = images.hurt;
  if (isMoving(monster)) image = images.surprised;
  if (monster.turn == TurnStage.attack) image = images.attack;
  if (lost) image = images.happy;
  if (!image) image = images.normal;

  return <ImageEl src={image} size={2 * monster.r} />;
}
