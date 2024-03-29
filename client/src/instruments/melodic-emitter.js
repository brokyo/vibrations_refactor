import * as Tone from "tone";
import _ from "lodash";
import { waveConfig, eventRanges } from "@/config/wave-config.js";
import { associateNoteAndColor } from "@/utilities/color-map.js";
const baseUrl = `http://localhost:3000/`;
import chroma from "chroma-js";

// `ChorirSection`s are objects that contain the individual Tone voices, and
// the color metadata for p5 and Hue.
const melodicEmitterDefaults = {
  portamento: 0.2,
  osc: {
    type: `pulse`,
    width: 0.5,
    detuneMin: -10,
    detuneMax: 10
  },
  env: {
    attackCurve: `linear`,
    decayCurve: `linear`,
    releaseCurve: `linear`
  },
  noise: {
    playbackRate: 0.7,
    volume: -10
  },
  voxOut: {
    gain: 0.2
  },
  lineOut: {
    volume: -30
  }
};

class MelodicEmitter {
  constructor(hueConfig) {
    let config = melodicEmitterDefaults;
    ///////////////
    // UNIVERSAL //
    ///////////////
    this.id = hueConfig.id;
    this.hueIntegration = hueConfig.integrated;
    this.active = null;
    this.key = {};

    ///////////
    // COLOR //
    ///////////
    this.tonicColor = { h: 0, s: 0, v: 0 };
    this.color = {
      changing: false,
      start: { h: 0, s: 0, v: 0 },
      end: { h: 0, s: 0, v: 0 },
      current: { h: 0, s: 0, v: 0 },
      iterator: 0,
      iteratorStep: 0.033
    };

    ///////////
    // VOICE //
    ///////////
    this.voice = {};
    this.voice.portamento = config.portamento;

    // -- VOX -- //
    this.voice.voxOut = new Tone.Gain(config.voxOut.gain);

    this.voice.oscs = _.times(15, function() {
      return new Tone.OmniOscillator({
        type: config.osc.type,
        width: config.osc.width,
        detune: _.random(config.osc.detuneMin, config.osc.detuneMax)
      }).start();
    });

    this.voice.envs = _.times(15, function() {
      return new Tone.AmplitudeEnvelope({
        attackCurve: config.env.attackCurve,
        decayCurve: config.env.decayCurve,
        releaseCurve: config.env.releaseCurve
      });
    });

    this.voice.oscs.forEach((osc, index) => osc.connect(this.voice.envs[index]));
    this.voice.envs.forEach(env => env.connect(this.voice.voxOut));

    // -- WHITE NOISE -- //
    this.voice.noise = new Tone.Noise({
      playbackRate: config.noise.playbackRate,
      volume: config.noise.volume
    }).start();

    this.voice.noise.connect(this.voice.envs[0]);

    // -- FORMANTS -- //
    this.voice.formantOut = new Tone.Gain();

    this.voice.lfoNodes = _.times(5, function() {
      return new Tone.LFO({
        type: `sine`,
        min: 0,
        max: 1,
        phase: 0,
        frequency: `4n`,
        amplitude: 1
      }).start();
    });

    this.voice.formantNodes = _.times(5, function() {
      return new Tone.Filter({
        type: `bandpass`,
        rolloff: -24
      });
    });

    // // connect each lfo node to its corresonding formant to oscillate filter frequency
    this.voice.lfoNodes.forEach((lfoNode, index) => {
      // lfoNode.connect(this.voice.formantNodes[index].frequency);
    });

    this.voice.volumeNodes = _.times(5, function() {
      return new Tone.Volume();
    });

    // fan voxOut signal across formant chains to formantOut where it's recombined
    for (let i = 0; i < 5; i++) {
      this.voice.voxOut.chain(
        this.voice.formantNodes[i],
        this.voice.volumeNodes[i],
        this.voice.formantOut
      );
    }

    // -- EFFECTS -- //
    this.voice.position = new Tone.Panner(0);
    this.voice.lineOut = new Tone.Volume(config.lineOut.gain);

    this.voice.formantOut.chain(this.voice.position, this.voice.lineOut);
  }

  updateKey(key) {
    this.key = key;
    let tonicColor = associateNoteAndColor(key.tonic).webColor;
    this.tonicColor = { h: tonicColor.h, s: tonicColor.s, v: 0.25 };
    this.changeFormant(key.formant.filters);
  }

  start() {
    this.active = true;
  }

  stop() {
    this.active = false;
  }

  changeFormant(formantConfig) {
    formantConfig.forEach((config, index) => {
      this.voice.formantNodes[index].set({
        frequency: config.frequency,
        Q: config.frequency / config.bw
      });

      this.voice.volumeNodes[index].set({
        volume: config.volume
      });
    });
  }

  generateEventConfig(key) {
    let eventConfig = {
      pitch: _.sample(key.pitches),
      attack: _.random(eventRanges.attack.min, eventRanges.attack.max),
      sustain: _.random(eventRanges.sustain.min, eventRanges.sustain.max),
      release: _.random(eventRanges.release.min, eventRanges.release.max),
      rest: _.random(eventRanges.rest.min, eventRanges.rest.max)
    };

    return eventConfig;
  }

  // TODO: Don't use yet. It doesn't look right.
  waveStart(timeline) {
    let emitter = this;
    var startEvent = new Tone.ToneEvent(time => {
      p5StartEvent(emitter);
      hueStartEvent(emitter);
    });
    startEvent.type = `start`;
    startEvent.time = 0;
    startEvent.start(Tone.now());
    timeline.add(startEvent);

    function p5StartEvent(emitter) {
      emitter.color.changing = true;
      emitter.color.start = emitter.color.current;
      emitter.color.end = emitter.tonicColor;
      emitter.color.iteratorStep = 1 / (1 * 30);
    }

    function hueStartEvent(emitter) {
      let hueConfig = {
        id: emitter.id,
        h: emitter.tonicColor.h,
        s: emitter.tonicColor.s,
        b: emitter.tonicColor.v,
        duration: 1
      };

      fetch(baseUrl + `hue/attack`, {
        method: `POST`,
        headers: { "Content-Type": `application/json` },
        body: JSON.stringify(hueConfig)
      });
    }
  }

  createAttackEvent(eventConfig, startShift) {
    var attackEvent = new Tone.ToneEvent(time => {
      let emitter = this;
      toneAttackEvent(eventConfig, time, emitter);
      p5AttackEvent(eventConfig, emitter);

      if (emitter.hueIntegration) {
        hueAttackEvent(eventConfig, emitter);
      }
    });
    attackEvent.type = `attack`;
    attackEvent.time = 0;
    attackEvent.pitch = eventConfig.pitch;
    attackEvent.start(Tone.now() + startShift);

    return attackEvent;

    function toneAttackEvent(eventConfig, time, emitter) {
      emitter.voice.oscs.forEach(osc => {
        osc.frequency.linearRampToValueAtTime(
          Tone.Frequency(eventConfig.pitch).toFrequency(),
          time + emitter.voice.portamento
        );
      });

      emitter.voice.envs.forEach(env => {
        env.set({ attack: eventConfig.attack, release: eventConfig.release });
        env.triggerAttack(`+0`, eventConfig.velocity);
      });
    }

    function p5AttackEvent(eventConfig, emitter) {
      emitter.color.changing = true;
      emitter.color.start = chroma(emitter.color.current).hex();
      emitter.color.end = associateNoteAndColor(eventConfig.pitch).webColor;
      emitter.color.iteratorStep = 1 / (eventConfig.attack * 30);
    }

    function hueAttackEvent(evenConfig, emitter) {
      let pitchColor = associateNoteAndColor(eventConfig.pitch).hueColor;

      let hueConfig = {
        id: emitter.id,
        h: pitchColor.h,
        s: pitchColor.s,
        b: pitchColor.v,
        duration: eventConfig.attack
      };

      fetch(baseUrl + `hue/attack`, {
        method: `POST`,
        headers: { "Content-Type": `application/json` },
        body: JSON.stringify(hueConfig)
      });
    }
  }

  createReleaseEvent(eventConfig, startShift) {
    let releaseEvent = new Tone.ToneEvent(time => {
      let emitter = this;
      toneReleaseEvent(emitter);
      p5ReleaseEvent(eventConfig, emitter);

      if (emitter.hueIntegration) {
        hueReleaseEvent(eventConfig, emitter);
      }
    });
    releaseEvent.time = 0;
    releaseEvent.type = `release`;
    releaseEvent.start(Tone.now() + startShift);

    return releaseEvent;

    function toneReleaseEvent(emitter) {
      emitter.voice.envs.forEach(env => {
        env.triggerRelease();
      });
    }

    function p5ReleaseEvent(eventConfig, emitter) {
      emitter.color.changing = true;
      emitter.color.start = emitter.color.current;
      emitter.color.end = emitter.tonicColor;
      emitter.color.iteratorStep = 1 / (eventConfig.release * 30);
    }

    function hueReleaseEvent(eventConfig, emitter) {
      let hueConfig = {
        id: emitter.id,
        h: emitter.tonicColor.h,
        s: emitter.tonicColor.s,
        v: emitter.tonicColor.v,
        duration: eventConfig.release
      };

      fetch(baseUrl + `hue/release`, {
        method: `POST`,
        headers: { "Content-Type": `application/json` },
        body: JSON.stringify(hueConfig)
      });
    }
  }

  defaultColors(baseRelease) {
    baseRelease = baseRelease / 1000;
    let emitter = this;
    p5CompletedEvent(emitter, baseRelease);

    if (emitter.hueIntegration) {
      hueCompletedEvent(emitter, baseRelease);
    }

    function p5CompletedEvent(emitter, baseRelease) {
      emitter.color.changing = true;
      emitter.color.start = emitter.color.current;
      emitter.color.end = `#000000`;
      emitter.color.iteratorStep = 1 / (baseRelease * 30);
    }

    function hueCompletedEvent(emitter) {
      let hueConfig = {
        id: emitter.id,
        duration: baseRelease
      };

      fetch(baseUrl + `hue/completed`, {
        method: `POST`,
        headers: { "Content-Type": `application/json` },
        body: JSON.stringify(hueConfig)
      });
    }
  }

  createCompletedEvent(startShift) {
    let completedEvent = new Tone.ToneEvent(time => {
      this.active = false;
    });
    completedEvent.time = 0;
    completedEvent.section = `melodic`;
    completedEvent.start(Tone.now() + startShift);
    return completedEvent;
  }

  generateWave(key) {
    // let waveEventsArray = [];

    // startShift is a running counter that adds 
    let startShift = _.random(
      waveConfig.startShift.min,
      waveConfig.startShift.max
    );

    for (let i = 0; i < waveConfig.notesInWave; i++) {
      // Creates the timing and musicality data that is used by each event in the wave
      let eventConfig = this.generateEventConfig(key);

      // Schedule the attack for p5, tone, and hue along Tone's timeline
      this.createAttackEvent(eventConfig, startShift);
      // waveEventsArray.push(attackEvent);
      startShift += eventConfig.attack + eventConfig.sustain;
      let releaseEvent = this.createReleaseEvent(eventConfig, startShift);
      // waveEventsArray.push(releaseEvent);
      startShift += eventConfig.release + eventConfig.rest;
    }
    let completedEvent = this.createCompletedEvent(startShift);
    // waveEventsArray.push(completedEvent);

    // return waveEventsArray;
  }

  scheduleEvents() {
    this.generateWave(this.key);
    this.active = true;
  }
}

function createMelodicEmitter(config) {
  return new MelodicEmitter(config);
}

export { createMelodicEmitter };
