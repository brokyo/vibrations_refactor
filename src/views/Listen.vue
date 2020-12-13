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
        key: {
          name: null,
          tonic: null,
          type: null,
          scale: []
        },
        utterance: {
          prefix: null,
          type: null,
          text: null
        },
        activeCard: {}
      }
    };
  },
  methods: {
    //USER ACTIONS
    async enterSpace() {
      // TODO: Error handling
      await this.initLibraries();
      await this.configureLibraries();
      await this.generateWave();
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

      this.toneMeta.toneSpace = spaceGenerator.createToneSpace();

      this.connectTone();

      return true;
    },
    async connectTone() {
      this.toneMeta.baseToneEmitter.out.connect(this.toneMeta.toneSpace.in);
      this.toneMeta.melodicToneEmitters.forEach(emitter => {
        emitter.voice.lineOut.connect(this.toneMeta.toneSpace.in);
      });
      this.toneMeta.toneSpace.out.connect(Tone.Master);
    },
    async generateWave() {
      await this.getNewUtterance();
      await this.getNewScale();
    },
    async getNewUtterance() {
      let utterance = await import(`@/modules/utterance-generator.js`).then(
        module => {
          return module.getUtterance();
        }
      );

      this.waveMeta.utterance = utterance;

      return true;
    },
    async getNewScale() {
      //TODO: should probably dynamically import Tonal too
      let key = {
        tonic: null,
        type: null,
        name: null,
        scale: []
      };
      const possibleNotes = [`A`, `B`, `C`, `D`, `E`, `F`, `G`];

      // Build Key

      // Major Wave Setup
      if (Math.random() > 0.75) {
        let tonicNote = this.$_.sample(possibleNotes);
        let baseOctave = 3;
        let tonic = tonicNote.concat(baseOctave);

        key.tonic = tonic;
        key.type = `minor`;
        key.name = `${tonic.slice(0, -1)} ${key.type}`;
        key.scale = Tonal.Key.minorKey(tonic).melodic.scale;

      // Minor Wave Setup
      } else {
        let tonicNote = this.$_.sample(possibleNotes);
        let baseOctave = 4;
        let tonic = tonicNote.concat(baseOctave);

        key.tonic = tonic;
        key.type = `major`;
        key.name = `${tonic.slice(0, -1)} ${key.type}`;
        key.scale = Tonal.Key.majorKey(tonic).scale;
      }

      // Expand scale
      let lowerNotes = [];
      let higherNotes = [];
      for (let i = 0; i < 4; i++) {
        let noteBelow = Tonal.Tonal.transpose(key.scale[i + 3], `-8P`);
        let noteAbove = Tonal.Tonal.transpose(key.scale[i], `8P`);
        lowerNotes.push(noteBelow);
        higherNotes.push(noteAbove);
      }

      key.scale = lowerNotes.concat(key.scale).concat(higherNotes);

      this.waveMeta.key = key;
    },
    async updateEmitterTimbre() {
      // Change timbre for Major
      // let partials = [];
      // this.toneMeta.baseEmitter.synth.voices.forEach(voice => {
      //   voice.set({ type: partials });
      // });
      // // Change timbre for Minor
      // let partials = [0.615, 0.29, 0.155, 0.03, 0.065, 0.83, 0, 0, 0];
      // this.toneMeta.baseEmitter.synth.voices.forEach(voice => {
      //   voice.set({ partials: partials });
      // });
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
