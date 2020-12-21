<template>
  <div>
    <div id="about-banner" v-if="!started">
      <p class="header">
        <span class="title">Vibrations</span> is a tool for cybermystic
        contemplation.
      </p>
      <p class="subtext">
        <span class="title">Vibrations</span> helps the universe communicate
        through synchronicity by combining waves of color and sound with
        AI-generated text. Each instance is unique to you, now.
      </p>
      <p class="subtext">Please use it when you're getting lost.</p>
      <p class="subtext">
        Language model trained on a cyber new age corpus and sound-to-light
        correspondence based on mystical 1900s system.
        <a
          class="blogpost"
          href="https://github.com/brokyo/vibrations"
          target="_blank"
          >[README]</a
        >
      </p>

      <div id="start-button" @click="enterSpace">
        <span>it only works if you believe</span>
      </div>
    </div>
    <div id="canvas-holder"></div>
    <img 
      id="screenshot-button" 
      @click="saveImage" 
      src="@/assets/camera.svg" 
    />
    <img
      id="fullscreen-button"
      @click="toggleFullScreen"
      src="@/assets/fullscreen.svg"
    />
  </div>
</template>

<script>
import { generateKey } from "@/modules/scheduler.js";
let Tone, p5;
export default {
  name: `Listen`,
  data: function() {
    return {
      started: false,
      p5Meta: {
        initialized: false,
        configured: false,
        color: null,
        activeColorArray: [],
        canvas: {}
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
        activeCard: null
      }
    };
  },
  computed: {
    finishedSections() {
      return this.$_.filter(this.toneMeta.melodicToneEmitters, {
        active: false
      }).length;
    }
  },
  watch: {
    finishedSections() {
      if (this.finishedSections == this.toneMeta.melodicToneEmitters.length) {
        this.endWave();
      }
    }
  },
  methods: {
    //USER ACTIONS
    async enterSpace() {
      // TODO: Error handling
      await this.initLibraries();
      await this.configureLibraries();
      await this.generateWave();

      this.started = true;

      // TODO: Sleeping because Tone.JS pops otherwise
      await this.sleep(2500);
      await this.startWave();
    },
    saveImage() {
      p5.save(this.p5Meta.canvas, `please_remember`, `png`);
    },
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
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
      this.p5Meta.canvas = vibrationCanvas;

      // Connect p5 sketch to relevant parts of reactive data object
      // TODO: This is a hack... is there a cleaner way?
      vibrationCanvas.baseToneEmitter = this.baseToneEmitter;
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
      let melodicEmitterGenerator = await import(
        `@/instruments/melodic-emitter.js`
      ).then(module => {
        return module;
      });

      this.$_.times(this.hueMeta.lightArray.length, () => {
        this.toneMeta.melodicToneEmitters.push(
          melodicEmitterGenerator.createMelodicEmitter()
        );
      });

      let baseEmitterGenerator = await import(
        `@/instruments/base-emitter.js`
      ).then(module => {
        return module;
      });

      this.toneMeta.baseToneEmitter = baseEmitterGenerator.createBaseEmitter();

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
      await this.generateUtterance();
      let key = await generateKey();
      this.toneMeta.baseToneEmitter.updateKey(key);
      this.toneMeta.baseToneEmitter.scheduleEvents(this.toneMeta.timeline);

      this.toneMeta.melodicToneEmitters.forEach(emitter => {
        emitter.updateKey(key);
        emitter.scheduleEvents(this.toneMeta.timeline);
      });
      this.waveMeta.activeCard = `title`;
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
    async startWave() {
      Tone.Master.mute = false;
      await this.sleep(5000);
      this.waveMeta.activeCard = `performance`;
      Tone.Transport.start();
    },
    async endWave() {
      // TODO: This should be the length of the final release
      await this.sleep(7500);
      this.toneMeta.baseToneEmitter.synth.releaseAll();
      await this.sleep(7500);
      this.generateWave();
      this.startWave();
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "Abel";
  src: url("/fonts/Abel-Regular.ttf");
}

body {
  font-family: "Abel";
  display: flex;
  margin: 0;
  align-items: center;
  justify-content: center;
}

.header {
  font-size: 38px;
}

.title {
  font-weight: 900;
}

.subtext {
  font-size: 20px;
}

.blogpost {
  color: black;
}

.spacer {
  margin-top: 26px;
}

#fullscreen-button {
  position: fixed;
  top: 10px;
  right: 10px;
  height: 30px;
  width: 30px;
  z-index: 1;
  opacity: 0.3;
}

#fullscreen-button:hover {
  opacity: 1;
}

#screenshot-button {
  position: fixed;
  top: 6px;
  right: 40px;
  height: 40px;
  width: 40px;
  z-index: 1;
  opacity: 0.3;
}

#screenshot-button:hover {
  opacity: 1;
}

#info-button {
  position: fixed;
  height: 30px;
  width: 30px;
  top: 0;
  right: 80px;
  top: 10px;
  z-index: 1;
}

#close-button {
  position: absolute;
  right: 0;
  top: 0;
  height: 40px;
  width: 40px;
}

#start-button {
  width: 300px;
  height: 50px;
  text-align: center;
  z-index: 1;
  margin: 140px auto 0px auto;
  border: 2px solid black;
  cursor: pointer;
}

#start-button:hover {
  background-color: white;
}

#start-button span {
  font-weight: 900;
  font-size: 22px;
  line-height: 50px;
}

#canvas-holder {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
}

#about-banner {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #dbd9d7;
  padding-top: 20px;
  z-index: 2;
}

#about-banner p {
  text-align: left;
  margin: 0 auto;
  padding-top: 12px;
  width: 500px;
}

#logo {
  position: fixed;
  bottom: 0px;
  right: 20px;
  height: 120px;
  width: 120px;
  opacity: 0.3;
}

#logo:hover {
  opacity: 1;
}
</style>
