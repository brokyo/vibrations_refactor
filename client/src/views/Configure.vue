<template>
  <div id="app">
    <h1>Hue Integration</h1>
    <div v-if="!hueUserCreated">
      <p>
        Press the link button on the center of your Philips Hue bridge then
        click the button below
      </p>
      <button v-if="!hueUserCreated" @click="startHue">Integrate</button>
    </div>
    <div v-if="hueUserCreated">
      <div>
        <p>
          Find all the lights on your network then pick the ones you want
          incluided in the performance
        </p>
        <button @click="findLights">Find Lights</button>
      </div>
      <hr />
      <div class="light_container">
        <span class="title">all lights [all lights on network]</span>
        <div>
          <div
            id="individualLight"
            v-for="(light, index) in lightArray"
            :key="light"
          >
            <p>{{ light.name }}: {{ light.id }}</p>
            <button class="lightButton" @click="testLight(light.id)">
              Test
            </button>
            <button
              class="lightButton"
              @click="addToPerformance(index, light.id)"
            >
              Add To Performance
            </button>
          </div>
        </div>
      </div>
      <hr />
      <div class="light_container">
        <span class="title"
          >performance lights [lights included in performance]</span
        >
        <div>
          <div
            id="individualLight"
            v-for="(light, index) in performanceArray"
            :key="light"
          >
            <p>{{ light.name }}: {{ light.id }}</p>
            <label>light position</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              v-model="light.position"
            />
            <button class="lightButton" @click="testLight(light.id)">
              Test
            </button>
            <button
              class="lightButton"
              @click="removeFromPerformance(index, light.id)"
            >
              Remove From Performance
            </button>
          </div>
        </div>
      </div>
      <hr />
      <div>
        <p>Click to save performance lights and start playback</p>
        <button @click="savePerformanceArray">Save Performance Array</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: `Configure`,
  data: function() {
    return {
      hueUserCreated: null,
      lightsFound: false,
      lightArray: [],
      performanceArray: []
    };
  },
  created() {
    fetch(`http://localhost:3000/hue/credential_check`)
      .then(response => {
        return response.json();
      })
      .then(data => {
        this.hueUserCreated = data.userExists;
      });
  },
  methods: {
    startHue() {
      fetch(`http://localhost:3000/hue/setup`)
        .then(results => {
          return results.json();
        })
        .then(json => {
          if (json.type === `error`) {
            alert(json.message);
          } else {
            this.hueUserCreated = true;
            this.findLights();
          }
        });
    },
    findLights() {
      fetch(`http://localhost:3000/hue/get_lights`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          console.log(json);
          this.lightArray = [];

          json.lightArray.forEach(light => {
            let lightObject = {
              id: light._data.id,
              name: light._data.productname,
              position: 0
            };

            this.lightArray.push(lightObject);
          });
        });
    },
    testLight(id) {
      let postData = {
        lightId: id
      };

      fetch(`http://localhost:3000/hue/test_light`, {
        method: `POST`,
        headers: { "Content-Type": `application/json` },
        body: JSON.stringify(postData)
      });
    },
    addToPerformance(index, lightId) {
      this.performanceArray.push(this.lightArray[index]);
      this.lightArray = this.lightArray.filter(light => light.id !== lightId);
    },
    removeFromPerformance(index, lightId) {
      this.lightArray.push(this.performanceArray[index]);
      this.performanceArray = this.performanceArray.filter(
        light => light.id !== lightId
      );
    },
    savePerformanceArray() {
      var postData = {
        array: this.performanceArray
      };

      fetch(`http://localhost:3000/hue/save_array`, {
        method: `POST`,
        headers: { "Content-Type": `application/json` },
        body: JSON.stringify(postData)
      }).then(res => {
        alert(`Performance lights saved. Moving you to performance.`);
        document.location.href = `/play`;
      });
    }
  }
};
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Abel&family=Montserrat&display=swap');

body {
  font-family: 'Monserrat';
}

.light_container {
  margin-top: 30px;
  margin-bottom: 30px;
}

.title {
  display: block;
  margin-bottom: 10px;
  font-size: 22px;
  font-weight: 900;
}

#individualLight {
  border: 1px solid black;
  text-align: center;
  display: inline-block;
  width: 180px;
  padding: 10px;
  margin-right: 20px;
}

.lightButton {
  width: 100%;
}
</style>
