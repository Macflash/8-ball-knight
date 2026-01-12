import ballhit from "./ballhit.mp3";
import balldrop from "./balldrop.mp3";
import bumper from "./bumper4.mp3";
import pocket from "./pocket2.mp3";
import scratch from "./scratchplunk.mp3";

import cueturn from "./cueturn.mp3";
import cuehurt from "./cuehurt.mp3";

import goblinturn from "./goblinturn.mp3";
import goblinhurt from "./goblinhurt.mp3";

import orcturn from "./orcturn.mp3";
import orchurt from "./orchurt.mp3";

const max = 10;
const audioEls = [];

export function play(sound) {
  if (audioEls.length < max) {
    audioEls.push(document.createElement("audio"));
  }
  const el = audioEls.pop();
  el.src = sound;
  //   document.append(el); Do we need this?
  el.addEventListener("loadeddata", function () {
    el.play();
  });
  el.addEventListener("ended", () => {
    el.src = "";
    el.srcObj = null;
  });
}

export function playBallHit() {
  play(ballhit);
}

export function playBallDrop() {
  play(balldrop);
}

export function playBumper() {
  play(bumper);
}

export function playPocket() {
  play(pocket);
}

export function playScratch() {
  play(scratch);
}

export function playCueTurn() {
  play(cueturn);
}
export function playCueHurt() {
  play(cuehurt);
}

export function playgoblinTurn() {
  play(goblinturn);
}
export function playgoblinHurt() {
  play(goblinhurt);
}

export function playorcTurn() {
  play(orcturn);
}
export function playorcHurt() {
  play(orchurt);
}
