import "./App.css";
import React from "react";
import { getLevel } from "./game/levels/level_defs";
import { LevelEl } from "./components/level";
import { getLevelState } from "./game/levels/level";

function App() {
  const [levelNum, setLevelNum] = React.useState(1);
  const [level, setLevel] = React.useState(getLevel(levelNum));

  const [wonorlost, setwonorlost] = React.useState(0);
  const won = wonorlost == 1;
  const lost = wonorlost == -1;

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <LevelEl
        key={levelNum}
        initialLevel={level}
        onTurnEnd={(newLevel) => {
          const { won, lost } = getLevelState(level);
          if (won) setwonorlost(1);
          if (lost) setwonorlost(-1);

          // setLevelNum(levelNum + 1);
          // setLevel(getLevel(levelNum + 1));
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 0,
          color: "white",
          fontSize: "2rem",
        }}
      >
        Level {levelNum}
      </div>

      {won ? (
        <div
          style={{
            position: "absolute",
            top: "50%",
            color: "gold",
            fontSize: 100,
          }}
        >
          You won!
          <div>
            <button
              onClick={() => {
                const newLevel = levelNum + 1;
                setLevelNum(newLevel);
                setLevel(getLevel(newLevel));
                setwonorlost(0);
              }}
            >
              Next level
            </button>
          </div>
        </div>
      ) : null}

      {lost && !won ? (
        <div
          style={{ position: "absolute", top: 0, color: "red", fontSize: 100 }}
        >
          GAME OVER!
          <br />
          <button
            onClick={() => {
              setLevelNum(0);
              setLevel(getLevel(0));
              setwonorlost(0);
            }}
          >
            New game?
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default App;
