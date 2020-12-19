<template>
  <div>
    <div class="start-screen">
      <div class="start-screen__button" @click="enterSpace">Enter Space</div>
      <div id="canvas-holder"></div>
    </div>
  </div>
</template>

<script>
import { generateKey, createBaseEventSchedule } from "@/modules/scheduler.js";

let Tone, p5;
export default {
  name: `Listen`,
  data: function() {
    return {
      p5Meta: {
        initialized: false,
        configured: false,
        color: null,
        activeColorArray: []
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
        toneSpace: {},
        timeline: null
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
      await this.scheduleWave();

      // TODO: Sleeping because Tone.JS pops otherwise
      await this.sleep(2500);
      Tone.Master.mute = false;
      await this.startWave();
    },
    // Utilities
    async sleep(ms) {
      await new Promise(resolve => setTimeout(resolve, ms));
    },
    // Initialize Libraries
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
      Tone.Master.mute = true;
      this.toneMeta.timeline = new Tone.Timeline();

      return true;
    },
    // Configure Libraries
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

      let defaultColorObject = {
        changing: true,
        start: `#000000`,
        end: `#000000`,
        iteratorStep: 0
      };

      this.$_.times(this.hueMeta.lightArray.length, () => {
        this.p5Meta.activeColorArray.push(defaultColorObject);
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
      return hueVals;
    },
    async configureTone() {
      // Get configured instruments
      let emitterGenerator = await import(
        `@/modules/toneEmitterGeneration.js`
      ).then(module => {
        return module;
      });

      this.$_.times(this.hueMeta.lightArray.length, () => {
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
    // Generate wave
    async generateWave() {
      let key = await generateKey();
      this.setEmitterTimbres(key);

      let baseToneEmitterSchedule = await createBaseEventSchedule(
        key,
        this.toneMeta.baseToneEmitter
      );

      this.scheduleBaseToneEmitter(baseToneEmitterSchedule);

      this.toneMeta.melodicToneEmitters.forEach(emitter => {
        emitter.scheduleWave(key, this.toneMeta.timeline);
      });
    },
    async generateUtterance() {
      let utterance = await import(`@/modules/utterance-generator.js`).then(
        module => {
          return module.getUtterance();
        }
      );

      this.waveMeta.utterance = utterance;

      return true;
    },
    // TODO: Move all emitter stuff into components?
    async setEmitterTimbres(key) {
      // Change baseToneEmitter voice
      if (key.type == `major`) {
        let partials = [];
        this.toneMeta.baseToneEmitter.synth.voices.forEach(voice => {
          voice.set({ type: partials });
        });
      } else if (key.type == `minor`) {
        let partials = [0.615, 0.29, 0.155, 0.03, 0.065, 0.83, 0, 0, 0];
        this.toneMeta.baseToneEmitter.synth.voices.forEach(voice => {
          voice.set({ partials: partials });
        });
      }

      // Change melodicToneEmitter formant
      this.toneMeta.melodicToneEmitters.forEach(emitter => {
        emitter.changeFormant(key.formant.filters);
      });
    },
    scheduleBaseToneEmitter(schedule) {
      schedule.forEach(event => {
        this.toneMeta.timeline.add(event);
      });
    },
    scheduleWave() {
      //
      // Tone.Master.mute = false
      // this.toneMeta.baseToneEmitter.synth.triggerAttack(this.waveMeta.key.tonic);
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
    },
    startWave() {
      Tone.Transport.start();
    }
  }
};
</script>

<style lang="scss">
html {
  background-color: black;
}
.start-screen {
  color: red;
}

.start-screen__button {
  color: red;
}
</style>
