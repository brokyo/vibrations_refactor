import * as Tone from "tone";
import _ from "lodash";
import {
  baseEmitterDefaults,
  melodicEmitterDefaults
} from "../config/instrument-config.js";
import { eventRanges } from "@/config/wave-config.js";

// `BaseEmitter` is the underlying drone. It's a polysynth made up one one complex
///// waveform and a bunch of effects. Takes a config or uses defaults set elsewhere
class BaseEmitter {
  constructor(userConfig) {
    let config = userConfig == undefined ? baseEmitterDefaults : userConfig;
    this.color = {
      web: { h: 0, s: 0, v: 0 },
      hue: { h: 0, s: 0, v: 0 }
    };
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
}

// `ChorirSection`s are objects that contain the individual Tone voices, and
// the color metadata for p5 and Hue.
class MelodicEmitter {
  constructor(userConfig) {
    let config = userConfig == undefined ? melodicEmitterDefaults : userConfig;
    ///////////////
    // UNIVERSAL //
    ///////////////
    this.id = null;
    this.active = false;

    ///////////
    // COLOR //
    ///////////
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

    this.voice.oscs.forEach((osc, index) =>
      osc.connect(this.voice.envs[index])
    );
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
      lfoNode.connect(this.voice.formantNodes[index].frequency);
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
    this.voice.lineOut = new Tone.Gain(config.lineOut.gain);

    this.voice.formantOut.chain(this.voice.position, this.voice.lineOut);
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
      attack: _.random(eventRanges.attack.min, eventRanges.attack.max).toFixed(
        2
      ),
      sustain: _.random(
        eventRanges.sustain.min,
        eventRanges.sustain.max
      ).toFixed(2),
      release: _.random(
        eventRanges.release.min,
        eventRanges.release.max
      ).toFixed(2),
      rest: _.random(eventRanges.rest.min, eventRanges.rest.max).toFixed(2)
    };

    return eventConfig;
  }

  createAttackEvent(eventConfig, startShift) {
    var attackEvent = new Tone.Event(time => {
      let emitter = this;
      toneAttackEvent(eventConfig, time, emitter);
      p5AttackEvent(eventConfig, emitter);
    });
    attackEvent.type = `attack`;
    attackEvent.time = 0;
    attackEvent.degree = eventConfig.pitch;
    attackEvent.start(Tone.Time().now() + startShift);
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
      emitter.color.start = emitter.color.current;
      emitter.color.end = emitter.webColor;
      emitter.color.iteratorStep = 1 / (eventConfig.attack * 30);
    }
  }

  createReleaseEvent(eventConfig, startShift) {
    let releaseEvent = new Tone.Event(time => {
      console.log(`release`);
      toneReleaseEvent();
      p5ReleaseEvent(eventConfig);
    });
    releaseEvent.time = 0;
    releaseEvent.type = `release`;
    releaseEvent.start(Tone.Time().now() + startShift);

    return releaseEvent;

    function toneReleaseEvent() {
      console.log(this);
      this.voice.envs.forEach(env => {
        env.triggerRelease();
      });
    }

    function p5ReleaseEvent(eventConfig) {
      this.color.changing = true;
      this.color.start = this.color.current;
      // this.color.end = baseSynth.color.web;
      this.color.iteratorStep = 1 / (eventConfig.release * 30);
    }
  }

  createCompletedEvent(eventConfig, startShift) {
    let endEvent = new Tone.Event(time => {
      this.active = false;
      console.log(`im done`);
    });
  }

  generateWave(key) {
    let waveEventsArray = [];
    let startShift = 0;

    var hack = [{}, {}, {}, {}, {}, {}];

    hack.forEach(async _ => {
      let eventConfig = this.generateEventConfig(key);
      let attackEvent = this.createAttackEvent(eventConfig, startShift);
      waveEventsArray.push(attackEvent);
      startShift += eventConfig.attack + eventConfig.sustain;
      let releaseEvent = this.createReleaseEvent(eventConfig, startShift);
      waveEventsArray.push(releaseEvent);
      startShift += eventConfig.release + eventConfig.rest;
    });

    return waveEventsArray;
  }

  scheduleWave(key, timeline) {
    let schedule = this.generateWave(key);
    schedule.forEach(event => {
      timeline.add(event);
    });
  }
}

function createBaseToneEmitter(config) {
  return new BaseEmitter(config);
}

// if (this.hueIntegration) {
//   this.choirSections = this.$_.times(4, i => {
//     return new module.ChoirSection({
//       id: this.lightArray[i].id,
//       oscCount: 10,
//       position: this.lightArray[i].position
//     });
//   });
// } else {
//   let sectionPositions = [-1, -0.5, 0.5, 1];
//   this.choirSections = this.$_.times(4, i => {
//     return new module.ChoirSection({
//       id: null,
//       oscCount: 10,
//       position: sectionPositions[i]
//     });
//   });
// }
function createMelodicToneEmitter(config) {
  return new MelodicEmitter(config);
}

export { createBaseToneEmitter, createMelodicToneEmitter };
