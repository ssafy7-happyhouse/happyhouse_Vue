<template>
  <div class="wrapper">
    <notifications></notifications>
    <side-bar style="z-index:1090;">
      <template slot="links">
        <sidebar-item
          @click.native="closeFilterAndSideBar"
          :link="{
            name: 'Home',
            path: '/home',
            icon: 'ni ni-tv-2 text-primary'
          }"
        >
        </sidebar-item>

        <sidebar-item
          @click.native="closeFilterAndSideBar"
          :link="{
            name: 'QnA',
            path: '/qna',
            icon: 'ni ni-bullet-list-67 text-red'
          }"
        >
        </sidebar-item>

        <sidebar-item
          @click.native="closeFilterAndSideBar"
          :link="{
            name: 'News',
            path: '/news',
            icon: 'ni ni ni-world-2 text-red'
          }"
        >
        </sidebar-item>

        <sidebar-item
          @click.native="closeFilterAndSideBar"
          :link="{
            name: 'User Profile',
            path: '/profile',
            icon: 'ni ni-single-02 text-yellow'
          }"
          v-if="userInfo"
        >
        </sidebar-item>

        <sidebar-item
          @click.native="closeFilterAndSideBar"
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
          @click.native="closeFilterAndSideBar"
          :link="{
            name: 'Register',
            path: '/register',
            icon: 'ni ni-circle-08 text-pink'
          }"
          v-if="!userInfo"
        >
        </sidebar-item>

        <sidebar-item
          :link="{
            name: 'management',
            path: '/management',
            icon: 'ni ni-planet text-blue'
          }"
          v-if="adminCheck()"
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
              전용면적 : {{ value[0][0] }} 평 이상 ~ {{ value[0][1] }} 평 미만
            </h5>
            <vue-slider
              v-model="value[0]"
              :process="process"
              :tooltip="'none'"
              :min="0"
              :max="100"
              :interval="20"
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
        [0, 100],
        [0, 30],
        [0, 21]
      ],
      marks_1: [0, 20, 40, 60, 80, 100],
      marks_2: [0, 5, 10, 15, 20, 25, 30],
      marks_3: [0, 3, 6, 9, 12, 15, 18, 21],
      process: dotsPos => [
        [dotsPos[0], dotsPos[1], { backgroundColor: "#5e72e4" }]
      ]
    };
  },
  computed: {
    ...mapState("userStore", ["userInfo"])
  },
  filters: {
    yearFormat(value) {
      return "20" + (value < 10 ? "0" + value : value);
    }
  },
  watch: {
    value(val) {
      this.REMOVE_OVERLAYS;
      this.REMOVE_MARKERS;
      let level = this.level;
      let map = this.map;
      let check = true;
      this.changeZoom({ level, map, check });

      this.setFilterValue(val);
    }
  },
  methods: {
    ...mapActions("mapStore", [
      "makeMarker",
      "markerClick",
      "setFilterValue",
      "changeZoom"
    ]),
    adminCheck() {
      if (this.userInfo == null) {
        return false;
      }
      if (this.userInfo.id == "admin") {
        return true;
      } else {
        return false;
      }
    },
    closeFilterAndSideBar() {
      document.getElementById("customSidebar").style.width = "0px";
      document.getElementById("custom-filter").style.left = "-80%";
    },
    filterClose() {
      document.getElementById("custom-filter").style.left = "-80%";
    },
    filterReset() {
      this.value = [
        [0, 100],
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
      this.closeFilterAndSideBar();
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
      "REMOVE_CLUSTERER",
      "SET_FILTERVALUE"
    ]),

    ...mapState(userStore, ["userInfo"]),
    ...mapState("mapStore", ["map", "clusterer", "level"])
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
  text-align: center;
}
.customoverlay {
  position: relative;
  bottom: 65px;
  border-radius: 6px;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  float: left;
}
.customoverlay:nth-of-type(n) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}
.customoverlay a {
  display: block;
  text-decoration: none;
  color: #000;
  text-align: center;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  background: #d95050;
  background: #d95050
    url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/arrow_white.png)
    no-repeat right 14px center;
}

.customoverlay .title {
  display: block;
  text-align: center;
  background: #fff;
  padding: 10px 15px;
  font-size: 14px;
  font-weight: bold;
}
.customoverlay:after {
  content: "";
  position: absolute;
  margin-left: -12px;
  left: 50%;
  bottom: -12px;
  width: 22px;
  height: 12px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png");
}
</style>
