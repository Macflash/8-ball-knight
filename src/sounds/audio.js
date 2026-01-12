import ballhit from "./ballhit.mp3";
import balldrop from "./balldrop.mp3";
import bumper from "./bumper4.mp3";
import pocket from "./pocket2.mp3";
import scratch from "./scratchplunk.mp3";

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
