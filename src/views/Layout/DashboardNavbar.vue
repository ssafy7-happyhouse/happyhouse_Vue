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
    <b-navbar-nav class="align-items-center ml-md-auto"> </b-navbar-nav>
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

            <div
              class="input-group-append"
              @click="search"
              style="cursor:pointer;"
            >
              <span class="input-group-text"
                ><i class="fas fa-search"></i
              ></span>
            </div>
            <ul
              class="dropdown-menu"
              id="myDropdown"
              style="z-index: 3; height: 400px; overflow: scroll; overflow-x: hidden;"
            >
              <template>
                <b-dropdown-header class="noti-title">
                  <h6 class="text-overflow m-0">주소</h6>
                </b-dropdown-header>

                <b-dropdown-item
                  v-for="address in addresses"
                  :key="address.dongCode"
                  @click="
                    moveAddress(
                      address.dongCode,
                      address.gugunName,
                      address.dongName
                    )
                  "
                >
                  <span>{{ address.gugunName }} {{ address.dongName }}</span>
                </b-dropdown-item>

                <div class="dropdown-divider"></div>

                <b-dropdown-header class="noti-title">
                  <h6 class="text-overflow m-0">아파트</h6>
                </b-dropdown-header>

                <b-dropdown-item
                  v-for="apartment in apartments"
                  :key="apartment.aptCode"
                  @click="
                    moveApt(apartment.aptCode, apartment.lat, apartment.lng)
                  "
                >
                  <span name="${apartment.aptCode}">{{
                    apartment.aptName
                  }}</span>
                </b-dropdown-item>
              </template>
            </ul>
          </b-input-group> </b-form-group
        ><base-button
          type="secondary"
          style="margin-left: 10px;"
          @click="filterClick"
          >filter</base-button
        >
      </b-form>
    </b-navbar-nav>
    <b-navbar-nav class="align-items-center ml-md-auto"> </b-navbar-nav>
    <div>
      <b-modal id="alert-modal" ref="alert-modal" hide-footer>
        <template #modal-title> 경고! </template>
        <div class="d-block text-center">
          <h3>{{ alertMessage }}</h3>
        </div>
        <b-button class="mt-3" block @click="$bvModal.hide('alert-modal')"
          >Close</b-button
        >
      </b-modal>
    </div>
  </base-nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { BaseNav, Modal } from "@/components";
import { dongList } from "@/api/address";
import { aptListByName } from "@/api/apartment";
import { mapState, mapActions } from "vuex";

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
      apartments: [],
      aptList: [],
      alertMessage: ""
    };
  },
  methods: {
    ...mapActions("mapStore", ["getAptDetail", "getAptListByDongCode"]),
    filterClick() {
      if (document.getElementById("custom-filter").style.left == "50px") {
        document.getElementById("custom-filter").style.left = "-80%";
      } else {
        document.getElementById("custom-filter").style.left = "50px";
      }
    },
    search() {
      if (this.searchQuery.length < 2) {
        this.$refs["alert-modal"].show();
        this.alertMessage = "두 글자 이상 입력해주세요.";
        return;
      }
      document.getElementById("myDropdown").classList.toggle("show");
      dongList(
        this.searchQuery == "" ? "ASDFASDF" : this.searchQuery,
        response => {
          this.addresses = response.data;
        },
        error => {}
      );
      aptListByName(
        this.searchQuery == "" ? "ASDFASDF" : this.searchQuery,
        response => {
          this.apartments = response.data;
        },
        error => {}
      );
    },
    moveApt(aptCode, lat, lng, event) {
      document.getElementById("myDropdown").classList.remove("show");
      document.getElementById("customSidebar").style.width = "500px";

      let pageNum = 1;
      let pageSize = 6;
      this.getAptDetail({ aptCode, pageNum, pageSize });
      this.map.setLevel(2);
      this.map.panTo(new kakao.maps.LatLng(lat, lng));
      this.addresses = [];
      this.apartments = [];
    },
    moveAddress(dongCode, gugunName, dongName) {
      const geocoder = new kakao.maps.services.Geocoder();
      let pageNum = 1;
      let pageSize = 6;
      this.getAptListByDongCode({ dongCode, pageNum, pageSize });

      // 주소로 좌표를 검색합니다
      const map = this.map;
      geocoder.addressSearch(gugunName + " " + dongName, function(
        result,
        status
      ) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          map.panTo(new kakao.maps.LatLng(result[0].y, result[0].x));
          map.setLevel(3);
        }
      });
      this.addresses = [];
      this.apartments = [];
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

window.onclick = e => {
  if (e.target.class != "myDropdown") {
    document.getElementById("myDropdown").classList.remove("show");
  }
};
</script>
