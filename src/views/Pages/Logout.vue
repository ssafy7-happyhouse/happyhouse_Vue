<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-primary py-7 py-lg-8 pt-lg-9">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white"></h1>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>
    <!-- Page content -->
    <b-container class="mt--8 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <!-- <b-card-header class="bg-transparent pb-5">
              <div class="text-muted text-center mt-2 mb-3"></div>
              <div class="btn-wrapper text-center"> -->
            <!-- <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"
                    ><img src="img/icons/common/kakaologo.jpg"
                  /></span>
                  <span class="btn-inner--text">카카오톡으로 시작</span>
                </a> -->
            <!-- <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"
                    ><img src="img/icons/common/google.svg"
                  /></span>
                  <span class="btn-inner--text">Google</span>
                </a> -->
            <!-- </div>
            </b-card-header> -->
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <!-- <small>다른 방법으로 로그인</small> -->
              </div>
              <!-- <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              > -->
              <b-form role="form" @submit.prevent="logout">
                <!-- <base-input
                    alternative
                    class="mb-3"
                    name="id"
                    :rules="{ required: true }"
                    prepend-icon="ni ni-email-83"
                    placeholder="id"
                    v-model="model.id"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    name="Password"
                    :rules="{ required: true }"
                    prepend-icon="ni ni-lock-circle-open"
                    type="password"
                    placeholder="Password"
                    v-model="model.password"
                  >
                  </base-input> -->

                <!-- <b-form-checkbox v-model="model.rememberMe"
                    >Remember me</b-form-checkbox
                  > -->
                <div class="text-center">
                  <base-button type="primary" native-type="submit" class="my-4"
                    >로그아웃</base-button
                  >
                </div>
              </b-form>
              <!-- </validation-observer> -->
            </b-card-body>
          </b-card>
          <b-row class="mt-3">
            <!-- <b-col cols="6">
              <router-link to="/dashboard" class="text-light"
                ><small>Forgot password?</small></router-link
              >
            </b-col> -->
            <!-- <b-col cols="7" class="text-right">
              <router-link to="/register" class=""
                ><small>회원가입</small></router-link
              >
            </b-col> -->
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import { dropKakaoUser } from "@/services/kakaoLogin";

const userStore = "userStore";

export default {
  computed: {
    ...mapState(userStore, ["userInfo"])
  },
  methods: {
    ...mapMutations(userStore, ["SET_IS_LOGIN", "SET_USER_INFO"]),
    logout() {
      console.log(sessionStorage.getItem("refresh-token"));
      if (sessionStorage.getItem("refresh-token")) {
        Kakao.Auth.logout(function() {});
      }
      sessionStorage.clear();
      this.SET_USER_INFO(null);
      this.SET_IS_LOGIN(false);
      // dropKakaoUser();
      this.$router.push({ name: "home" });
    }
  },
  created() {
    this.logout();
  }
};
</script>
