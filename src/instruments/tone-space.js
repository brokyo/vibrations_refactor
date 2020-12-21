import * as Tone from "tone";
import { spaceConfigDefaults } from "../config/tone-space-config.js";

function createToneSpace(userConfig) {
  let config = userConfig == undefined ? spaceConfigDefaults : userConfig;
  let toneSpace = {
    in: new Tone.Gain(),
    reverb: new Tone.Freeverb(config.reverb),
    tremolo: new Tone.Tremolo(config.tremolo),
    delay: new Tone.PingPongDelay(config.delay),
    eq: new Tone.EQ3(config.eq),
    out: new Tone.Gain()
  };

  toneSpace.in.chain(
    toneSpace.reverb,
    toneSpace.tremolo,
    toneSpace.delay,
    toneSpace.eq,
    toneSpace.out
  );

  return toneSpace;
}

export { createToneSpace };
