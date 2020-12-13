<template>
  <div>
    <div class="start-screen">
      <div class="start-screen__button" @click="enterSpace">Enter Space</div>
      <div id="canvas-holder"></div>
    </div>
  </div>
</template>

<script>
import * as Tonal from "@tonaljs/tonal";
let Tone, p5;
export default {
  name: `Listen`,
  data: function() {
    return {
      p5Meta: {
        initialized: false,
        configured: false,
        color: null
      },
      hueMeta: {
        initialized: false,
        configured: false,
        lightArray: []
      },
      toneMeta: {
        initialized: false,
        configured: false,
        baseToneEmitter: null,
        melodicToneEmitters: [],
        toneSpace: {}
      },
      waveMeta: {
        count: 0,
        prefix: null,
        tonic: null,
        key: null,
        utterance: {
          length: null,
          text: null
        },
        activeCard: {},
        possibleNotes: [],
        possibleChords: []
      }
    };
  },
  methods: {
    //USER ACTIONS
    async enterSpace() {
      // TODO: Error handling
      let initialLibraryValues = await this.initLibraries();
      let configuredLibraryValues = await this.configureLibraries();
      console.log(configuredLibraryValues);
      // let configuredWaveValues = await this.configureWave();
      // let waveScheduled = await this.scheduleWave();
    },
    // MACHINE ACTIONS
    async initLibraries() {
      let visualsInitialized = await this.initP5();
      let lightsInitialized = await this.initHue();
      let soundInitialized = await this.initTone();

      return await Promise.all([
        visualsInitialized,
        lightsInitialized,
        soundInitialized
      ]);
    },
    async initP5() {
      p5 = await import(`p5`).then(module => {
        return module.default;
      });
      this.p5Meta.initialized = true;

      return true;
    },
    async initHue() {
      this.hueMeta.integration = false;
      this.hueMeta.lightArray = [{}, {}, {}];
      this.hueMeta.initialized = true;

      return true;
    },
    async initTone() {
      Tone = await import(`tone`).then(module => {
        return module.default;
      });
      this.toneMeta.initialized = true;

      return true;
    },
    async configureLibraries() {
      let visualsConfigured = await this.configureP5();
      let lightsConfigured = await this.configureHue();
      let soundConfigured = await this.configureTone();

      return await Promise.all([
        visualsConfigured,
        lightsConfigured,
        soundConfigured
      ]);
    },
    async configureP5() {
      let vibrationCanvas = await import(`@/modules/create-p5`).then(module => {
        return new p5(module.s);
      });

      // Connect p5 sketch to relevant parts of reactive data object
      // TODO: This is a hack... is there a cleaner way?
      vibrationCanvas.melodicToneEmitters = this.toneMeta.melodicToneEmitters;
      vibrationCanvas.waveMeta = this.waveMeta;

      return true;
    },
    async configureHue() {
      // Hue logic here
      let hueVals = false;
      console.log(hueVals);
      return true;
    },
    async configureTone() {
      // Get configured instruments
      let emitterGenerator = await import(
        `@/modules/toneEmitterGeneration.js`
      ).then(module => {
        return module;
      });

      this.$_.times(this.hueMeta.lightArray.length, i => {
        console.log(i);
        this.toneMeta.melodicToneEmitters.push(
          emitterGenerator.createMelodicToneEmitter()
        );
      });

      this.toneMeta.baseToneEmitter = emitterGenerator.createBaseToneEmitter();

      let spaceGenerator = await import(
        `@/modules/toneSpaceGeneration.js`
      ).then(module => {
        return module;
      });

      this.toneSpace = spaceGenerator.createToneSpace();

      return true;
    },
    async connectTone() {
      this.baseEmitter.out.connect(this.toneSpace.in);
      this.melodicToneEmitters.forEach(emitter => {
        emitter.out.connect(this.toneSpace.in);
      });
      this.toneSpace.out.connect(Tone.Master);
    },
    getNewUtterance() {
      // TODO: This import is probably more trouble than it's worth. Maybe look into persisting `this`?
      let dataModel = this;
      import(`@/modules/utterances.js`).then(module => {
        let selectedUtterance = module.getUtterance();
        dataModel.waveMeta.prefix = selectedUtterance.prefix;
        dataModel.waveMeta.utterance.type = selectedUtterance.type;
        dataModel.waveMeta.utterance.text = selectedUtterance.text;
      });
    },
    getNewTimbre() {
      import(`@/config/instrument-config.js`).then(module => {
        let randomFormant = this.$_.random(0, module.formantPresets.length - 1);

        this.choirSections.forEach(section =>
          section.changeFormant(randomFormant)
        );
      });
    },
    getNewScale() {
      let key = {};
      let baseOctave, tonic;

      if (Math.random() > 0.75) {
        baseOctave = 3;
        tonic = this.newTonic(baseOctave);

        key.type = `major`;
        key.tonic = tonic;
        key.scale = Tonal.Key.majorKey(tonic).scale;

        // Change timbre
        let partials = [];
        this.baseSynth.synth.voices.forEach(voice => {
          voice.set({ type: partials });
        });
      } else {
        baseOctave = 2;
        tonic = this.newTonic(baseOctave);

        key.type = `minor`;
        key.tonic = tonic;
        key.scale = Tonal.Key.minorKey(tonic).melodic.scale;

        // Change timbre
        let partials = [0.615, 0.29, 0.155, 0.03, 0.065, 0.83, 0, 0, 0];
        this.baseSynth.synth.voices.forEach(voice => {
          voice.set({ partials: partials });
        });

        this.waveMeta.tonic = tonic;
        this.waveMeta.key = `${tonic.slice(0, -1)} ${key.type}`;
      }

      let lowerNotes = [];
      let higherNotes = [];
      for (let i = 0; i < 4; i++) {
        let noteBelow = Tonal.Tonal.transpose(key.scale[i + 3], `-8P`);
        let noteAbove = Tonal.Tonal.transpose(key.scale[i], `8P`);
        lowerNotes.push(noteBelow);
        higherNotes.push(noteAbove);
      }

      this.possibleNotes = lowerNotes.concat(key.scale).concat(higherNotes);
      this.possibleChords = key.chords;

      import(`@/modules/color-map.js`).then(module => {
        let nextColor = this.$_.find(module.colorMap, {
          note: tonic.slice(0, -1)
        });
        this.baseSynth.color.web = {
          h: nextColor.webColor.h,
          s: nextColor.webColor.s,
          v: 0.15
        };
        this.baseSynth.color.hue = nextColor.hueColor;
        this.baseSynth.color.hue.v = 0;
      });
    },

    newTonic(baseOctave) {
      const possibleNotes = [`A`, `B`, `C`, `D`, `E`, `F`, `G`];
      let tonic = this.$_.sample(possibleNotes);
      tonic += baseOctave;

      return tonic;
    },

    scheduleWave() {
      this.waveMeta.count++;
      this.getNewUtterance();
      this.getNewTimbre();
      this.getNewScale();
      // baseSynth.synth.triggerAttack(waveMeta.tonic);
      // activeCard = `title`;

      // setTimeout(() => {
      //   activeCard = `performance`;
      //   for (let i = 0; i < sections.length; i++) {
      //     sections[i].active = true;
      //     sections[i].color.iteratorStep =
      //       1 / (baseSynthConfig.synth.envelope.attack * fps);
      //     sections[i].color.start = `#000000`;
      //     sections[i].color.end = baseSynth.color.web;
      //     sections[i].color.changing = true;
      //     scheduleEvents(i);
      //   }
      // }, 11000);

      // console.table(waveMeta);
    }
  }
};
</script>

<style lang="scss">
.start-screen {
  color: red;
}

.start-screen__button {
  color: red;
}
</style>
