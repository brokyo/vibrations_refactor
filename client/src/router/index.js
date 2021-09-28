import Vue from "vue";
import VueRouter from "vue-router";
import Listen from "../views/Listen.vue";
import Configure from "../views/Configure.vue";
import Authenticate from "../views/Authenticate.vue";
import Catch from "../views/Catch.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: `/`,
    name: `Listen`,
    component: Listen
  },
  {
    path: `/authenticate`,
    name: `Authenticate`,
    component: Authenticate
  },
  {
    path: `/catch`,
    name: `Catch`,
    component: Catch
  },
  {
    path: `/configure`,
    name: `Configure`,
    component: Configure
  }
];

const router = new VueRouter({
  mode: `history`,
  base: process.env.BASE_URL,
  routes
});

export default router;
