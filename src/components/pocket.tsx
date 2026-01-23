import { BallEl } from "./ball";
import { isAlive } from "../game/types/hp";
import { Pocket } from "../game/types/pocket";
import { explosionPng } from "../images/misc/misc";

export function PocketEl({ pocket }: { pocket: Pocket }) {
  return (
    <BallEl ball={pocket} background={pocket.blocked ? "" : "black"}>
      {pocket.pocket && pocket.blocked ? (
        <img
          style={{ marginTop: -0.1 * pocket.r }}
          src={pocket.images.blocked}
          height={pocket.r * 3}
        ></img>
      ) : undefined}

      {pocket.explode ? (
        <img
          style={{ position: "absolute" }}
          src={explosionPng}
          height={pocket.r * 4}
        />
      ) : null}
    </BallEl>
  );
}
