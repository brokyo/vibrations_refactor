import Vue from "vue";
import VueRouter from "vue-router";
import Listen from "../views/Listen.vue";
import Configure from "../views/Configure.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: `/`,
    name: `Listen`,
    component: Listen
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
