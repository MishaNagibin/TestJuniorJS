import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import Vuetify from "vuetify/lib";

import "vuetify/dist/vuetify.css";
import "@mdi/font/css/materialdesignicons.css";

import Main from "./Main.vue";
import User from "./components/User.vue";

import store from "../../store";

Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Vuetify, { iconfont: "mdi" });

new Vue({
  vuetify: new Vuetify(),
  router: new VueRouter({
    routes: [
      {
        path: "/",
        name: "Main",
        component: Main,
      },
      {
        path: "/user/:userId",
        name: "user",
        component: User,
      },
    ],
  }),
  store,
  render: (h) => h(Main),
}).$mount("#app");
