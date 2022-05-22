/*!

=========================================================
* BootstrapVue Argon Dashboard - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/bootstrap-vue-argon-dashboard
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Vue from "vue";
import DashboardPlugin from "./plugins/dashboard-plugin";
import App from "./App.vue";
import store from "./store";
import VueCookies from "vue-cookies";

// router setup
import router from "./routes/router";
// plugin setup
Vue.use(DashboardPlugin);
Vue.use(VueCookies);

//쿠키의 만료일은 7일이다. (글로벌 세팅)
Vue.$cookies.config("7d");

window.Kakao.init("8096ea0691acbe00b8752ac93a7b4f37");

/* eslint-disable no-new */
new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
