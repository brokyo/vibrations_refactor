var waveConfig = {
  notesInWave: 2,
  startShift: {
    min: 2,
    max: 9
  },
  waveRest: 15
};

// var eventRanges = {
//   attack: {
//     min: 1.0,
//     max: 4.5
//   },
//   sustain: {
//     min: 2.5,
//     max: 4
//   },
//   release: {
//     min: 5,
//     max: 9
//   },
//   rest: {
//     min: 3,
//     max: 9
//   }
// };

var eventRanges = {
  velocity: {
    min: 0.4,
    max: 0.9
  },
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
}

export { waveConfig, eventRanges };
