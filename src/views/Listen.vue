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
        color: null
      },
      hueMeta: {
        lightArray: []
      },
      toneMeta: {
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
    enterSpace() {
      initP5()
      initHue()
      initTone()

      // then
      configureP5()
      configureHue()
      configureTone()

      // then
      configureWave()
      scheduleWave()

    },
    // MACHINE ACTIONS
    initP5() {
      import(`p5`).then(module => {
        p5 = module.default;
      });
    },
    configureP5() {
      import(`@/modules/create-p5`).then(module => {
        let myp5 = new p5(module.s);

        // connects myp5 to actively changing stuff in the reactive data
        myp5.choirSections = this.choirSections;
        myp5.activeCard = this.activeCard;
        myp5.waveMeta = this.waveMeta;
      });
    },
    initHue() {
      let lightArrayFound = false;
      this.hueIntegration = lightArrayFound ? true : false;
    },
    configureHue() {
      // Hue logic here
    },
    initTone() {
      import(`tone`).then(module => {
        Tone = module.default;
      });
    },
    configureTone() {
      // Get configured instruments
      import(`@/modules/toneEmitterGeneration.js`).then(module => {
        
        this.$_.times(lightArrayLength, i => {
          this.melodicToneEmitters.push(module.createMelodicEmitter());
        }
        this.baseEmitter = module.createBaseToneEmitter();
        })
      });

      import(`@/modules/toneSpaceGeneration.js`).then(module => {
        this.toneSpace = module.createToneSpace();
      });


      //then
      connectTone() {
        this.baseEmitter.out.connect(this.toneSpace.in);
        this.melodicToneEmitters.forEach(emitter => {
          emitter.out.connect(this.toneSpace.in);
        })
        this.toneSpace.out.connect(Tone.Master);
      }
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
