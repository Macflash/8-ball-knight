import React from "react";
import { Knight } from "../levels/knight";
import { orc } from "../levels/monsters";
import { Ball, isMoving, move } from "../physics/ball";
import { Table } from "../physics/table";
import { vec } from "../physics/vec";
import { Hero } from "./hero";
import { Monster } from "./monster";
import { TurnStage } from "./turn";

export interface GameState {
  hero: Hero;
  monsters: Monster[];

  // TODO: projectiles, shields, traps, etc.

  table: Table;
  pockets: Ball[];
}

export function level1(): GameState {
  return {
    hero: { ...Knight, p: vec(200, 300), turn: TurnStage.aim },
    monsters: [orc],

    table: new Table(400, 536),
    pockets: [],
  };
}
