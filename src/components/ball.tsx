import React from "react";
import { Ball } from "../game/physics/ball";
import { Vec } from "../game/physics/vec";

export function BallEl({
  ball,
  children,
  id,
  background,
  glow,
}: {
  ball: { r: number; p: Vec };
  id?: string;
  children?: React.ReactNode;
  glow?: string;
  background?: string;
}) {
  const shadow = glow ? `0 0 ${1 * ball.r}px ${1 * ball.r}px ${glow}` : "";
  return (
    <div
      id={id}
      style={{
        background, //: shadow ? glow : background,
        position: "absolute",
        marginLeft: ball.p.x - ball.r,
        marginTop: ball.p.y - ball.r,
        height: ball.r * 2,
        width: ball.r * 2,
        borderRadius: ball.r,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {glow ? (
        <div
          style={{
            position: "absolute",
            zIndex: 0,
            height: 0,
            width: 0,
            borderRadius: 2 * ball.r,
            boxShadow: shadow,
          }}
        ></div>
      ) : undefined}
      {children}
    </div>
  );
}
