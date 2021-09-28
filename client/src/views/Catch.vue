<template>
  <div></div>
</template>

<script>
let hue_api = require(`node-hue-api`).v3
const CLIENT_ID = `6ZKa9K8xaAbIkAT84UVDQGPYhaj4DfLF`
const CLIENT_SECRET = `iZOGAuImNj84KBTd`
const APP_ID = `waves`
const STATE = `babybaby`
const remoteBootstrap = hue_api.api.createRemote(CLIENT_ID, CLIENT_SECRET);

export default {
    data: function() {
        return {
            authCode: null
        }
    },
    mounted() {
        remoteBootstrap.connectWithCode(this.authCode)
            .catch(err => {
                console.error('Failed to get a remote connection using authorization code.');
                console.error(err);
                process.exit(1);
            }).then(api => {
                console.log('Successfully validated authorization code and exchanged for tokens');

                const remoteCredentials = api.remote.getRemoteAccessCredentials();

                console.log(`Remote API Access Credentials:\n ${JSON.stringify(remoteCredentials, null, 2)}\n`);
                console.log(`The Access Token is valid until:  ${new Date(remoteCredentials.tokens.access.expiresAt)}`);
                console.log(`The Refresh Token is valid until: ${new Date(remoteCredentials.tokens.refresh.expiresAt)}`);
                console.log('\nNote: You should securely store the tokens and username from above as you can use them to connect\n'
                    + 'in the future.');

                hue_api.api.lights.getAll().then(lights => {
                    console.log(lights)
                })

            })
    }
};
</script>

<style lang="scss"></style>
