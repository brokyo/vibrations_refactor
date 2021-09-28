<template>
  <div>
    <h1>Connect Your Hue Bulbs</h1>
    <span>This application controls your Hue light system. In order to do that you need to click the button below and sign into (or create) a Hue account</span>
    <span>You will only need to do this once.</span>
    <div>
        <button @click="authenticate">Click</button>
    </div>
  </div>
</template>

<script>
let hue_api = require(`node-hue-api`).v3
const CLIENT_ID = `6ZKa9K8xaAbIkAT84UVDQGPYhaj4DfLF`
const CLIENT_SECRET = `iZOGAuImNj84KBTd`
const APP_ID = `waves`
const STATE = `babybaby`
const remoteBootstrap = hue_api.api.createRemote(CLIENT_ID, CLIENT_SECRET);

export default {
    methods: {
        authenticate() {
            document.location.href = remoteBootstrap.getAuthCodeUrl('node-hue-api-remote', APP_ID, STATE)
        }
    },
    mounted() {
    }
};
</script>

<style lang="scss"></style>
