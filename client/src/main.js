import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import _ from "lodash";

Object.defineProperty(Vue.prototype, `$_`, { value: _ });
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount(`#app`);
