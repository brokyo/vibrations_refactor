import { Scale, Note } from "@tonaljs/tonal";
import _ from "lodash";
import { getRandomFormant } from "@/config/formant-config.js";

// Returns the key that the wave is played in
async function generateKey() {
  // Init object to be returned
  let key = {
    name: null,
    tonic: null,
    type: null,
    formant: null,
    pitches: []
  };

  const possibleTonics = [`A`, `B`, `C`, `D`, `E`, `F`, `G`];
  let tonicNote = _.sample(possibleTonics);

  // Randomly (with bias) select key characteristics
  // NB: Some repeated code because I inted for these to diverge more
  if (Math.random() > 0.75) {
    key.type = `minor`;
    let baseOctave = 3;
    let tonic = tonicNote.concat(baseOctave);
    key.tonic = tonic;
  } else {
    key.type = `major`;
    let baseOctave = 4;
    let tonic = tonicNote.concat(baseOctave);
    key.tonic = tonic;
  }
  key.name = `${key.tonic.slice(0, -1)} ${key.type}`;

  // Add some pitches in higher and lower octaves for variety
  let basePitches = Scale.get(`${key.tonic} ${key.type}`).notes;
  let lowerPitches = [];
  let higherPitches = [];
  for (let i = 0; i < 4; i++) {
    let pitchesBelow = Note.transpose(basePitches[i + 3], `-8P`);
    let pitchesAbove = Note.transpose(basePitches[i], `8P`);
    lowerPitches.push(pitchesBelow);
    higherPitches.push(pitchesAbove);
  }

  key.pitches = lowerPitches.concat(basePitches).concat(higherPitches);
  key.formant = await getRandomFormant();
  return key;
}

export { generateKey };
