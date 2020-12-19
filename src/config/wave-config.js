var waveConfig = {
  notesInWave: 6,
  startShift: {
    min: 1,
    max: 6
  },
  waveRest: 15
};

var eventRanges = {
  velocity: {
    min: 0.4,
    max: 0.9
  },
  // attack: {
  // 	min: 1.0,
  // 	max: 4.5
  // },
  // sustain: {
  // 	min: 5,
  // 	max: 8
  // },
  // release: {
  // 	min: 10,
  // 	max: 18
  // },
  // rest: {
  // 	min: 6,
  // 	max: 18
  // }
  attack: {
    min: 0.2,
    max: 1.0
  },
  sustain: {
    min: 1,
    max: 2
  },
  release: {
    min: 0.2,
    max: 0.4
  },
  rest: {
    min: 2,
    max: 4
  }
};

export { waveConfig, eventRanges };
