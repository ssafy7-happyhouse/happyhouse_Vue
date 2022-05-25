<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar style="z-index:1090;">
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
          v-if="!userInfo"

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
 left:-80%; top:20%; padding:30px; border-radius: 10px;"
        >
          <div class="mb-5">
            <h5>
              전용면적 : {{ value[0][0] }} m<sup>2</sup> 이상 ~
              {{ value[0][1] }} m<sup>2</sup> 미만
            </h5>
            <vue-slider
              v-model="value[0]"
              :process="process"
              :tooltip="'none'"
              :min="0"
              :max="300"
              :interval="50"
              :marks="marks_1"
            ></vue-slider>
          </div>
          <div class="mb-5">
            <h5>
              거래가격 : {{ value[1][0] }} 억 이상 ~ {{ value[1][1] }} 억 미만
            </h5>
            <vue-slider
              v-model="value[1]"
              :process="process"
              :tooltip="'none'"
              :min="0"
              :max="30"
              :interval="5"
              :marks="marks_2"
            ></vue-slider>
          </div>
          <div class="mb-5">
            <h5>
              건축년도 : {{ value[2][0] | yearFormat }} 년 ~
              {{ value[2][1] | yearFormat }} 년
            </h5>
            <vue-slider
              v-model="value[2]"
              :process="process"
              :tooltip="'none'"
              :min="0"
              :max="21"
              :interval="3"
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
      value: [
        [0, 300],
        [0, 30],
        [0, 21]
      ],
      marks_1: [0, 50, 100, 150, 200, 250, 300],
      marks_2: [0, 5, 10, 15, 20, 25, 30],
      marks_3: [0, 3, 6, 9, 12, 15, 18, 21],
      process: dotsPos => [
        [dotsPos[0], dotsPos[1], { backgroundColor: "#5e72e4" }]
      ]
    };
  },
  filters: {
    yearFormat(value) {
      return "20" + (value < 10 ? "0" + value : value);
    }
  },
  watch: {
    value(val) {
      this.REMOVE_CLUSTERER;
      this.REMOVE_OVERLAYS;
      this.REMOVE_MARKERS;

      this.makeMarker({
        clusterer: this.clusterer,
        map: this.map,
        minArea: val[0][0],
        maxArea: val[0][1],
        minAmount: val[1][0] * 10000,
        maxAmount: val[1][1] * 10000,
        minBuildYear: val[2][0] + 2000,
        maxBuildYear: val[2][1] + 2000
      });
    }
  },
  methods: {
    ...mapActions("mapStore", ["makeMarker", "markerClick"]),

    filterClose() {
      document.getElementById("custom-filter").style.left = "-40%";
    },
    filterReset() {
      this.value = [
        [0, 300],
        [0, 30],
        [0, 21]
      ];
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
    ...mapMutations("mapStore", [
      "REMOVE_MARKERS",
      "REMOVE_OVERLAYS",
      "REMOVE_CLUSTERER"
    ]),

    ...mapState(userStore, ["userInfo"]),
    ...mapState("mapStore", ["map", "clusterer"])
  }
};
</script>
<style>
.custom-marker {
  font-size: x-small;
  position: relative;
  bottom: 20px;
  color: white;
  cursor: pointer;
}
</style>
