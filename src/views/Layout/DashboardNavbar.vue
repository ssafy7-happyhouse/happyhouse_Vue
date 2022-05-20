<template>
  <base-nav
    container-classes="container-fluid"
    class="navbar-top navbar-expand"
    :class="{ 'navbar-dark': type === 'default' }"
  >
    <a
      href="#"
      aria-current="page"
      class="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block active router-link-active "
    >
      {{ $route.name }}
    </a>
    <!-- Navbar links -->
    <b-navbar-nav class="align-items-center ml-md-auto">
      <!-- This item dont have <b-nav-item> because item have data-action/data-target on tag <a>, wich we cant add -->
      <!-- <li class="nav-item d-sm-none">
        <a
          class="nav-link"
          href="#"
          data-action="search-show"
          data-target="#navbar-search-main"
        >
          <i class="ni ni-zoom-split-in"></i>
        </a>
      </li> -->
    </b-navbar-nav>
    <b-navbar-nav class="align-items-center ml-mr-auto ml-md-0">
      <b-form
        class="navbar-search form-inline mr-sm-3"
        :class="{
          'navbar-search-dark': type === 'default',
          'navbar-search-light': type === 'light'
        }"
        id="navbar-search-main"
        @submit.prevent="search"
      >
        <b-form-group class="mb-0">
          <b-input-group class="input-group-alternative input-group-merge">
            <b-form-input
              placeholder="Search"
              type="text"
              v-model="searchQuery"
              autocomplete="off"
            >
            </b-form-input>

            <div class="input-group-append">
              <span class="input-group-text"
                ><i class="fas fa-search"></i
              ></span>
            </div>
            <ul class="dropdown-menu" id="myDropdown" style="z-index: 3;">
              <template>
                <b-dropdown-header class="noti-title">
                  <h6 class="text-overflow m-0">주소</h6>
                </b-dropdown-header>

                <b-dropdown-item
                  v-for="address in addresses"
                  :key="address.dongCode"
                  @click="moveAddress"
                >
                  <span>{{ address.gugunName }} {{ address.dongName }}</span>
                </b-dropdown-item>

                <div class="dropdown-divider"></div>
                <b-dropdown-item
                  v-for="apartment in apartments"
                  :key="apartment.aptCode"
                  @click="moveAddress"
                >
                  <span name="${apartment.aptCode}">{{
                    apartment.aptName
                  }}</span>
                </b-dropdown-item>
              </template>
            </ul>
          </b-input-group>
        </b-form-group>
      </b-form>
    </b-navbar-nav>
    <b-navbar-nav class="align-items-center ml-md-auto"> </b-navbar-nav>
  </base-nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { BaseNav, Modal } from "@/components";
import { dongList } from "@/api/address";
import { aptListByName } from "@/api/apartment";
import { mapState } from "vuex";

export default {
  components: {
    CollapseTransition,
    BaseNav,
    Modal
  },
  props: {
    type: {
      type: String,
      default: "default", // default|light
      description:
        "Look of the dashboard navbar. Default (Green) or light (gray)"
    }
  },
  computed: {
    ...mapState("mapStore", ["map"]),

    routeName() {
      const { name } = this.$route;
      return this.capitalizeFirstLetter(name);
    }
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: "",
      addresses: [],
      apartments: []
    };
  },
  methods: {
    search() {
      document.getElementById("myDropdown").classList.toggle("show");
      dongList(
        this.searchQuery,
        response => {
          this.addresses = response.data;
        },
        error => {}
      );
      aptListByName(
        this.searchQuery,
        response => {
          this.apartments = response.data;
        },
        error => {}
      );
    },
    moveAddress(event) {
      const geocoder = new kakao.maps.services.Geocoder();
      // 주소로 좌표를 검색합니다
      const map = this.map;
      geocoder.addressSearch(
        event.currentTarget.getElementsByTagName("span")[0].innerHTML,
        function(result, status) {
          // 정상적으로 검색이 완료됐으면
          if (status === kakao.maps.services.Status.OK) {
            map.setCenter(new kakao.maps.LatLng(result[0].y, result[0].x));
            document.getElementById("myDropdown").classList.toggle("show");
          }
        }
      );
    },
    capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    toggleNotificationDropDown() {
      this.activeNotifications = !this.activeNotifications;
    },
    closeDropDown() {
      this.activeNotifications = false;
    }
  }
};
</script>
