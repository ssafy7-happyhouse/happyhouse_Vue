<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar>
      <template slot="links">
        <sidebar-item
          :link="{
            name: 'Home',
            path: '/home',
            icon: 'ni ni-tv-2 text-primary'
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Board',
            path: '/board',
            icon: 'ni ni-planet text-blue'
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'QnA',
            path: '/qna',
            icon: 'ni ni-bullet-list-67 text-red'
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'News',
            path: '/news',
            icon: 'ni ni ni-world-2 text-red'
          }"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'User Profile',
            path: '/profile',
            icon: 'ni ni-single-02 text-yellow'
          }"
          v-if="userInfo"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Login',
            path: '/login',
            icon: 'ni ni-key-25 text-info'
          }"
          v-if="!userInfo"
        >
        </sidebar-item>

        <sidebar-item
          @click="logout"
          :link="{
            name: 'Logout',
            path: '/logout',
            icon: 'ni ni-key-25 text-info'
          }"
          v-else
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'Register',
            path: '/register',
            icon: 'ni ni-circle-08 text-pink'
          }"
        >
        </sidebar-item>
      </template>
    </side-bar>
    <div class="main-content">
      <dashboard-navbar :type="$route.meta.navbarType"></dashboard-navbar>

      <div @click="$sidebar.displaySidebar(false)">
        <fade-transition :duration="200" origin="center top" mode="out-in">
          <!-- your content here -->
          <router-view></router-view>
        </fade-transition>
        <div
          id="custom-filter"
          style="height:400px; width:300px; background-color: white; position: absolute;  transition: 0.5s; 
 left:-40%; top:20%; padding:30px; border-radius: 10px;"
        >
          <div class="mb-5">
            <h5>
              전용면적 : {{ value_1[0] }} m<sup>2</sup> 이상 ~
              {{ value_1[1] }} m<sup>2</sup> 미만
            </h5>
            <vue-slider
              v-model="value_1"
              :min="0"
              :max="300"
              :marks="marks_1"
            ></vue-slider>
          </div>
          <div class="mb-5">
            <h5>
              거래가격 : {{ value_2[0] }} 억 이상 ~ {{ value_2[1] }} 억 미만
            </h5>
            <vue-slider
              v-model="value_2"
              :min="0"
              :max="30"
              :interval="0.1"
              :marks="marks_2"
            ></vue-slider>
          </div>
          <div class="mb-5">
            <h5>
              건축년도 : {{ value_3[0] | yearFormat }} 년 ~
              {{ value_3[1] | yearFormat }} 년
            </h5>
            <vue-slider
              v-model="value_3"
              :min="0"
              :max="22"
              :marks="marks_3"
            ></vue-slider>
          </div>
          <div>
            <base-button
              type="secondary"
              style="margin-left: 10px;"
              @click="filterReset"
              >초기화</base-button
            >
            <base-button
              type="secondary"
              style="margin-left: 10px;"
              @click="filterClose"
              >닫기</base-button
            >
          </div>
        </div>
        <custom-side-bar-right></custom-side-bar-right>
      </div>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>
<script>
/* eslint-disable no-new */
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import "vue-slider-component/theme/default.css";

function hasElement(className) {
  return document.getElementsByClassName(className).length > 0;
}

function initScrollbar(className) {
  if (hasElement(className)) {
    new PerfectScrollbar(`.${className}`);
  } else {
    // try to init it later in case this component is loaded async
    setTimeout(() => {
      initScrollbar(className);
    }, 100);
  }
}

import DashboardNavbar from "./DashboardNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import { FadeTransition } from "vue2-transitions";
import { mapMutations, mapState, mapActions } from "vuex";
import SideBar from "../../components/SidebarPlugin/SideBar.vue";
import { CustomSideBarRight } from "@/components";
import VueSlider from "vue-slider-component";

const userStore = "userStore";

export default {
  components: {
    DashboardNavbar,
    ContentFooter,
    DashboardContent,
    FadeTransition,
    CustomSideBarRight,
    SideBar,
    VueSlider
  },
  data() {
    return {
      value_1: [0, 300],
      value_2: [0, 30],
      value_3: [0, 22],
      marks_1: [0, 50, 100, 150, 200, 250, 300],
      marks_2: [0, 5, 10, 15, 20, 25, 30],
      marks_3: [0, 3, 6, 9, 12, 15, 18, 22]
    };
  },
  filters: {
    yearFormat(value) {
      return "20" + (value < 10 ? "0" + value : value);
    }
  },
  watch: {
    value_1(val) {
      this.REMOVE_MARKERS;
      let minAmount = this.value_2[0] * 10000;
      let maxAmount = this.value_2[1] * 10000;
      let minBuildYear = this.value_3[0] + 2000;
      let maxBuildYear = this.value_3[1] + 2000;
      this.makeMarker({
        map: this.map,
        minAmount: minAmount,
        maxAmount: maxAmount,
        minArea: val[0],
        maxArea: val[1],
        minBuildYear: minBuildYear,
        maxBuildYear: maxBuildYear
      });
    },
    value_2(val) {
      this.REMOVE_MARKERS;
      let minArea = this.value_1[0];
      let maxArea = this.value_1[1];
      let minBuildYear = this.value_3[0] + 2000;
      let maxBuildYear = this.value_3[1] + 2000;
      this.makeMarker({
        map: this.map,
        minAmount: val[0] * 10000,
        maxAmount: val[1] * 10000,
        minArea: minArea,
        maxArea: maxArea,
        minBuildYear: minBuildYear,
        maxBuildYear: maxBuildYear
      });
    },
    value_3(val) {
      this.REMOVE_MARKERS;
      let minArea = this.value_1[0];
      let maxArea = this.value_1[1];
      let minAmount = this.value_2[0] * 10000;
      let maxAmount = this.value_2[1] * 10000;
      this.makeMarker({
        map: this.map,
        minAmount: minAmount,
        maxAmount: maxAmount,
        minArea: minArea,
        maxArea: maxArea,
        minBuildYear: val[0] + 2000,
        maxBuildYear: val[1] + 2000
      });
    }
  },
  methods: {
    ...mapActions("mapStore", ["makeMarker"]),
    filterClose() {
      document.getElementById("custom-filter").style.left = "-40%";
    },
    filterReset() {
      this.value_1 = [0, 300];
      this.value_2 = [0, 30];
      this.value_3 = [0, 22];
      this.makeMarker({
        map: this.map,
        minAmount: 0,
        maxAmount: 300000,
        minArea: 0,
        maxArea: 300,
        minBuildYear: 2000,
        maxBuildYear: 2022
      });
    },
    initScrollbar() {
      let isWindows = navigator.platform.startsWith("Win");
      if (isWindows) {
        initScrollbar("sidenav");
      }
    },
    logout() {
      sessionStorage.clear();
      this.$router.push({ name: home });
    }
  },
  mounted() {
    this.initScrollbar();
    // console.log(userInfo);
  },
  computed: {
    ...mapMutations("mapStore", ["REMOVE_MARKERS"]),

    ...mapState(userStore, ["userInfo"]),
    ...mapState("mapStore", ["map"])
  }
  // created() {
  //   console.log(userInfo);
  // }
};
</script>
<style lang="scss"></style>
