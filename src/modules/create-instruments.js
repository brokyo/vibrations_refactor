import * as Tone from "tone";
import _ from "lodash";
import {
  baseSynthConfig,
  voiceConfig,
  formantPresets
} from "../config/instrument-config.js";

// `BaseSynth` is the underlying drone. It's a polysynth made up one one complex
// waveform and a bunch of effects
class BaseSynth {
  constructor(config) {
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
class ChoirSection {
  constructor(config) {
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
    this.voice.envs.forEach((env, index) => env.connect(this.voice.voxOut));

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
        type: "sine",
        min: 0,
        max: 1,
        phase: 0,
        frequency: "4n",
        amplitude: 1
      }).start();
    });

    this.voice.formantNodes = _.times(5, function(index) {
      return new Tone.Filter({
        type: "bandpass",
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

  changeFormant(index) {
    var vocalizationConfig = formantPresets[index].formants;

    vocalizationConfig.forEach((config, index) => {
      this.voice.formantNodes[index].set({
        frequency: config.frequency,
        Q: config.frequency / config.bw
      });

      this.voice.volumeNodes[index].set({
        volume: config.volume
      });
    });
  }
}

let baseSynth = new BaseSynth(baseSynthConfig);
let choirSection = new ChoirSection(voiceConfig)
export { baseSynth, choirSection };
