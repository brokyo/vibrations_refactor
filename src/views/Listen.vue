<template>
  <div>
    <div class="start-screen">
      <div class="start-screen__button" @click="initPlayback">START</div>
    </div>
  </div>
</template>

<script>
let Tone

export default {
  name: "Listen",
  data: function() {
    return {
      baseSynth: {},
      choirSection: {},
      roomChain: {},
      hueIntegration: null
    };
  },
  methods: {
    checkHueIntegration() {
      this.hueIntegration = false;
    },
    createInstruments() {
      import("@/modules/create-instruments.js").then(module => {
        this.baseSynth = module.baseSynth;
        this.choirSection = module.choirSection;
        this.createRoom();
      });
    },
    createRoom() {
      import("@/modules/create-room.js").then(module => {
        this.roomChain = module.roomChain;
        this.connectTone();
      })
    },
    connectTone() {
      this.baseSynth.out.connect(this.roomChain.in);
      this.roomChain.out.toMaster();
    },
    initPlayback() {
      import('tone').then(module => {
        Tone = module.default;
        this.createInstruments();
      });
      // start Tone.js
      // Tone.start();

      // mount p5
    }
  },
  mounted() {
    this.checkHueIntegration();
    // this.createInstruments();
    // this.createRoom();
    // this.connectTone();
  }
};
</script>

<style lang="scss">
.start-screen {
}

.start-screen__button {
  color: red;
}
</style>
