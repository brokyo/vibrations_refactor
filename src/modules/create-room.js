import * as Tone from "tone";
import _ from "lodash";
import { roomConfig } from "../config/room-config.js";

let roomChain = {};
roomChain.in = new Tone.Gain();
roomChain.reverb = new Tone.Freeverb(roomConfig.reverb);
roomChain.tremolo = new Tone.Tremolo(roomConfig.tremolo);
roomChain.delay = new Tone.PingPongDelay(roomConfig.delay);
roomChain.eq = new Tone.EQ3(roomConfig.eq);
roomChain.out = new Tone.Gain();
roomChain.in.chain(
  roomChain.reverb,
  roomChain.tremolo,
  roomChain.delay,
  roomChain.eq,
  roomChain.out
);

export { roomChain };
