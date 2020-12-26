import * as Tone from "tone";

const baseEmitterDefaults = {
  synth: {
    oscillator: {},
    envelope: {
      attack: 1.0,
      attackCurve: `linear`,
      decay: 0.1,
      release: 8,
      releaseCurve: `ripple`,
      sustain: 0.4
    }
  },
  tremolo: {
    depth: 0.3,
    frequency: 3.1,
    spread: 180,
    type: `sine`,
    wet: 0
  },
  vibrato: {
    depth: 0.1,
    frequency: 3.1,
    maxDelay: 0.005,
    type: `sine`,
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
    type: `sine`,
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
    type: `sine`,
    depth: 0.5
  },
  out: {
    gain: 0.5
  }
};

// `BaseEmitter` is the underlying drone. It's a polysynth made up one one complex
///// waveform and a bunch of effects. Takes a config or uses defaults set elsewhere
class BaseEmitter {
  constructor(userConfig) {
    let config = userConfig == undefined ? baseEmitterDefaults : userConfig;
    this.color = {
      web: { h: 0, s: 0, v: 0 },
      hue: { h: 0, s: 0, v: 0 }
    };
    this.key = {};
    this.synth = new Tone.PolySynth(10, Tone.AMSynth);
    this.synth.set(config.synth);
    this.tremolo = new Tone.Tremolo(config.tremolo);
    this.vibrato = new Tone.Vibrato(config.vibrato);
    this.phaser = new Tone.Phaser(config.phaser);
    this.feedbackDelay = new Tone.FeedbackDelay(config.feedbackDelay);
    this.chorus = new Tone.Chorus(config.chorus);
    this.EQ3 = new Tone.EQ3(config.EQ3);
    this.widener = new Tone.StereoWidener(config.widener);
    this.panner = new Tone.AutoPanner(config.panner);
    this.out = new Tone.Gain(config.out);

    this.synth.chain(
      this.tremolo,
      this.vibrato,
      this.phaser,
      this.feedbackDelay,
      this.chorus,
      this.EQ3,
      this.widener,
      this.panner,
      this.out
    );
  }

  updateKey(key) {
    this.key = key;

    if (key.type == `major`) {
      let partials = [];
      this.synth.voices.forEach(voice => {
        voice.set({ type: partials });
      });
    } else if (key.type == `minor`) {
      let partials = [0.615, 0.29, 0.155, 0.03, 0.065, 0.83, 0, 0, 0];
      this.synth.voices.forEach(voice => {
        voice.set({ partials: partials });
      });
    }
  }

  scheduleEvents(timeline) {
    let emitter = this;
    let schedule = [];

    function toneStart() {
      emitter.synth.triggerAttack(emitter.key.tonic, `+0.5`);
    }

    let startEvent = new Tone.Event(time => {
      toneStart();
    });
    startEvent.type = `base start`;
    startEvent.time = 0;
    startEvent.note = emitter.key.tonic;
    startEvent.section = `base`;
    startEvent.start(Tone.Time().now());

    schedule.push(startEvent);

    schedule.forEach(event => {
      timeline.add(event);
    });
  }
}

function createBaseEmitter() {
  return new BaseEmitter();
}

export { createBaseEmitter };
