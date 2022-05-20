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
      >
        <b-form-group class="mb-0">
          <b-input-group class="input-group-alternative input-group-merge">
            <b-form-input
              placeholder="Search"
              type="text"
              v-model="searchQuery"
              @keyup.enter="search"
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
                  v-for="(address, index) in addresses"
                  :key="index"
                  @click="moveAddress"
                >
                  <span>{{ address.gugunName }} {{ address.dongName }}</span>
                </b-dropdown-item>

                <div class="dropdown-divider"></div>
                <b-dropdown-header class="noti-title">
                  <h6 class="text-overflow m-0">아파트</h6>
                </b-dropdown-header>
              </template>
            </ul>
          </b-input-group>
        </b-form-group>
      </b-form>

      <base-dropdown
        menu-on-right
        class="nav-item"
        tag="li"
        title-tag="a"
        title-classes="nav-link pr-0"
      >
        <a href="#" class="nav-link pr-0" @click.prevent slot="title-container">
          <b-media no-body class="align-items-center">
            <span class="avatar avatar-sm rounded-circle">
              <img alt="Image placeholder" src="img/theme/team-4.jpg" />
            </span>
            <b-media-body class="ml-2 d-none d-lg-block">
              <span class="mb-0 text-sm  font-weight-bold">John Snow</span>
            </b-media-body>
          </b-media>
        </a>

        <template>
          <b-dropdown-header class="noti-title">
            <h6 class="text-overflow m-0">Welcome!</h6>
          </b-dropdown-header>
          <b-dropdown-item href="#!">
            <i class="ni ni-single-02"></i>
            <span>My profile</span>
          </b-dropdown-item>
          <b-dropdown-item href="#!">
            <i class="ni ni-settings-gear-65"></i>
            <span>Settings</span>
          </b-dropdown-item>
          <b-dropdown-item href="#!">
            <i class="ni ni-calendar-grid-58"></i>
            <span>Activity</span>
          </b-dropdown-item>
          <b-dropdown-item href="#!">
            <i class="ni ni-support-16"></i>
            <span>Support</span>
          </b-dropdown-item>
          <div class="dropdown-divider"></div>
          <b-dropdown-item href="#!">
            <i class="ni ni-user-run"></i>
            <span>Logout</span>
          </b-dropdown-item>
        </template>
      </base-dropdown>
    </b-navbar-nav>
    <b-navbar-nav class="align-items-center ml-md-auto"> </b-navbar-nav>
  </base-nav>
</template>
<script>
import { CollapseTransition } from "vue2-transitions";
import { BaseNav, Modal } from "@/components";
import { dongList } from "@/api/address";

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
      addresses: []
    };
  },
  methods: {
    search() {
      document.getElementById("myDropdown").classList.toggle("show");
      dongList(
        this.searchQuery,
        response => {
          this.addresses = response.data;
          console.log(this.addresses);
        },
        error => {}
      );
    },
    moveAddress(event) {
      console.log(
        event.currentTarget.getElementsByTagName("span")[0].innerHTML
      );
      document.getElementById("myDropdown").classList.toggle("show");
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
