<template>
  <div>
    <div class="start-screen">
      <div class="start-screen__button" @click="initPlayback">START</div>
      <div id="canvas-holder"></div>
    </div>
  </div>
</template>

<script>
import p5 from "p5";
let Tone;

export default {
  name: `Listen`,
  data: function() {
    return {
      hueIntegration: null,
      lightArray: [],
      baseSynth: {},
      choirSections: [],
      roomChain: {},
      activeCard: {},
      waveMeta: {}
    };
  },
  methods: {
    checkHueIntegration() {
      this.hueIntegration = false;
    },
    createInstruments() {
      import(`@/modules/create-instruments.js`).then(module => {
        this.baseSynth = module.baseSynth;

        if (this.hueIntegration) {
          this.choirSections = this.$_.times(4, i => {
            return new module.ChoirSection({
              id: this.lightArray[i].id,
              oscCount: 10,
              position: this.lightArray[i].position
            });
          });
        } else {
          let sectionPositions = [-1, -0.5, 0.5, 1];
          this.choirSections = this.$_.times(4, i => {
            return new module.ChoirSection({
              id: null,
              oscCount: 10,
              position: sectionPositions[i]
            });
          });
        }

        this.createRoom();
      });
    },
    createRoom() {
      import(`@/modules/create-room.js`).then(module => {
        this.roomChain = module.roomChain;
        this.connectTone();
      });
    },
    connectTone() {
      this.baseSynth.out.connect(this.roomChain.in);
      this.roomChain.out.toMaster();
    },
    initPlayback() {
      import(`tone`).then(module => {
        Tone = module.default;
        Tone.start();
        this.createInstruments();
        this.createP5();
      });
    },
    createP5() {
      import(`@/modules/create-p5`).then(module => {
        let myp5 = new p5(module.s);
        myp5.choirSections = this.choirSections;
        myp5.activeCard = this.activeCard;
        myp5.waveMeta = this.waveMeta;
      });
    }
  },
  mounted() {
    this.checkHueIntegration();
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
