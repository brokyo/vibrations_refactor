import * as Tone from "tone";
import _ from "lodash";
import { toneSpaceConfig } from "../config/toneSpaceConfig.js";

function configureToneSpace() {}

function createToneSpace(userConfig) {
    config = (userConfig == {}) ? baseEmitterDefaults: userConfig; 
    let toneSpace = {
        in: new Tone.Gain(),
        reverb: new Tone.Freeverb(roomConfig.reverb),
        tremolo: tremolo = new Tone.Tremolo(roomConfig.tremolo),
        eq: new Tone.EQ3(roomConfig.eq);
        out: new Tone.Gain()
    };

    chainSpace() {
        toneSpace.in.chain(
            toneSpace.reverb,
            toneSpace.tremolo,
            toneSpace.delay,
            toneSpace.eq,
            toneSpace.out
        );    
    }

    return toneSpace
}

export { createToneSpace };
