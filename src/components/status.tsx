import { HP } from "../game/hp";

export function StatusEl({
  h,
  attack,
  r = 0,
}: {
  h?: HP;
  attack?: number;
  r?: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        color: "white",
        top: -1 * r,
        width: "max-content",
      }}
    >
      {h ? `${h.p}♥️` : undefined}
      {attack ? ` ${attack}🗡️` : undefined}
    </div>
  );
}
