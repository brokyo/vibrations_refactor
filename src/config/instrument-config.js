const baseSynthConfig = {
  synth: {
    oscillator: {},
    envelope: {
      attack: 2.0,
      attackCurve: "linear",
      decay: 0.1,
      release: 8,
      releaseCurve: "ripple",
      sustain: 0.4
    }
  },
  tremolo: {
    depth: 0.3,
    frequency: 3.1,
    spread: 180,
    type: "sine",
    wet: 0
  },
  vibrato: {
    depth: 0.1,
    frequency: 3.1,
    maxDelay: 0.005,
    type: "sine",
    wet: 0.3
  },
  phaser: {
    Q: 10,
    baseFrequency: 669,
    frequency: 0.8,
    octaves: 3,
    stages: 10,
    wet: 0.2
  },
  feedbackDelay: {
    delayTime: 0.95,
    feedback: 0.6,
    wet: 0.4
  },
  chorus: {
    delayTime: 2.1,
    depth: 0.4,
    feedback: 0.1,
    frequency: 0.85,
    spread: 67,
    type: "sine",
    wet: 0.1
  },
  EQ3: {
    high: -1,
    mid: 0,
    low: -3
  },
  widener: {
    width: 0.8
  },
  panner: {
    frequency: 1,
    type: "sine",
    depth: 0.5
  },
  out: {
    gain: 0.5
  }
};
const baseSynthFollowerConfig = {
  triggerChance: 0.9,
  duration: {
    min: 10,
    max: 30
  },
  velocity: {
    min: 0.05,
    max: 0.3
  }
};
const voiceConfig = {
  portamento: 0.2,
  osc: {
    type: "pulse",
    width: 0.5,
    detuneMin: -10,
    detuneMax: 10
  },
  env: {
    attackCurve: "linear",
    decayCurve: "linear",
    releaseCurve: "linear"
  },
  noise: {
    playbackRate: 0.7,
    volume: -10
  },
  voxOut: {
    gain: 0.2
  },
  lineOut: {
    gain: 0.4
  }
};
const formantPresets = [
  {
    name: "a",
    type: "bass",
    formants: [
      {
        frequency: 600,
        volume: 0,
        bw: 60
      },
      {
        frequency: 1040,
        volume: -7,
        bw: 70
      },
      {
        frequency: 2250,
        volume: -7,
        bw: 110
      },
      {
        frequency: 2450,
        volume: -9,
        bw: 120
      },
      {
        frequency: 2750,
        volume: -20,
        bw: 130
      }
    ]
  },
  {
    name: "e",
    type: "bass",
    formants: [
      {
        frequency: 400,
        volume: 0,
        bw: 40
      },
      {
        frequency: 1620,
        volume: -12,
        bw: 80
      },
      {
        frequency: 2400,
        volume: -9,
        bw: 100
      },
      {
        frequency: 2800,
        volume: -12,
        bw: 120
      },
      {
        frequency: 3100,
        volume: -18,
        bw: 120
      }
    ]
  },
  {
    name: "i",
    type: "bass",
    formants: [
      {
        frequency: 250,
        volume: 0,
        bw: 60
      },
      {
        frequency: 1750,
        volume: -30,
        bw: 90
      },
      {
        frequency: 2600,
        volume: -16,
        bw: 100
      },
      {
        frequency: 3050,
        volume: -22,
        bw: 120
      },
      {
        frequency: 3340,
        volume: -28,
        bw: 120
      }
    ]
  },
  {
    name: "o",
    type: "bass",
    formants: [
      {
        frequency: 400,
        volume: 0,
        bw: 40
      },
      {
        frequency: 750,
        volume: -11,
        bw: 80
      },
      {
        frequency: 2400,
        volume: -21,
        bw: 100
      },
      {
        frequency: 2600,
        volume: -20,
        bw: 120
      },
      {
        frequency: 2900,
        volume: -40,
        bw: 120
      }
    ]
  },
  {
    name: "u",
    type: "bass",
    formants: [
      {
        frequency: 350,
        volume: 0,
        bw: 40
      },
      {
        frequency: 600,
        volume: -20,
        bw: 80
      },
      {
        frequency: 2400,
        volume: -32,
        bw: 100
      },
      {
        frequency: 2675,
        volume: -28,
        bw: 120
      },
      {
        frequency: 2950,
        volume: -36,
        bw: 120
      }
    ]
  }
];

export {
  baseSynthConfig,
  baseSynthFollowerConfig,
  voiceConfig,
  formantPresets
};
