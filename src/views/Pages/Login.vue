<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white">환영합니다!</h1>
              <p class="text-lead text-white">
                로그인을 한 후, 다양한 서비스를 즐겨보세요!
              </p>
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
            <b-card-header class="bg-transparent pb-5">
              <div class="text-muted text-center mt-2 mb-3"></div>
              <div class="btn-wrapper text-center">
                <a href="#" class="btn btn-icon">
                  <span class="btn-inner--text" @click="kakaoLogin"
                    ><img src="img/icons/common/kakaoLogo.png"
                  /></span>
                </a>

                <!-- <a href="#" class="btn btn-neutral btn-icon">
                  <span class="btn-inner--icon"
                    ><img src="img/icons/common/google.svg"
                  /></span>
                  <span class="btn-inner--text">Google</span>
                </a> -->
              </div>
            </b-card-header>
            <b-card-body class="px-lg-5 py-lg-5">
              <div class="text-center text-muted mb-4">
                <small>다른 방법으로 로그인</small>
              </div>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
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
                  </base-input>

                  <!-- <b-form-checkbox v-model="model.rememberMe"
                    >Remember me</b-form-checkbox
                  > -->
                  <div class="text-center">
                    <base-button
                      type="primary"
                      native-type="submit"
                      class="my-4"
                      >로그인</base-button
                    >
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
          <b-row class="mt-3">
            <!-- <b-col cols="6">
              <router-link to="/dashboard" class="text-light"
                ><small>Forgot password?</small></router-link
              >
            </b-col> -->
            <b-col cols="7" class="text-right">
              <router-link to="/register" class=""
                ><small>회원가입</small></router-link
              >
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { getKakaoToken, getKakaoUserInfo } from "@/services/kakaoLogin";
import VueCookies from "vue-cookies";

const userStore = "userStore";
// window.Kakao.init("8096ea0691acbe00b8752ac93a7b4f37");
// kakao.isInitialized();

// console.log(kakao.isInitialized());

export default {
  data() {
    return {
      model: {
        id: "",
        password: ""
        // rememberMe: false
      }
    };
  },
  computed: {
    ...mapState(userStore, ["isLogin", "isLoginError"])
  },
  methods: {
    ...mapActions(userStore, ["userConfirm", "getUserInfo"]),
    ...mapMutations(userStore, ["SET_USER_INFO"]),
    async onSubmit() {
      // this will be called only after form is valid. You can do api call here to login
      await this.userConfirm(this.model);
      let token = sessionStorage.getItem("access-token");
      if (this.isLogin) {
        // await this.getUserInfo(token);
        console.log(token);
        console.log(this.model);
        this.$router.push({ name: "home" });
      }
    },
    kakaoLogin() {
      const param = {
        redirectUri: "http://localhost:8080/login"
      };
      window.Kakao.Auth.authorize(param);
    },
    async setKakaoToken() {
      console.log("카카오 인증 코드", this.$route.query.code);
      const { data } = await getKakaoToken(this.$route.query.code);
      if (data.error) {
        alert("카카오톡 로그인 오류입니다.");
        this.$router.go();
        return;
      }
      window.Kakao.Auth.setAccessToken(data.access_token);
      // this.$cookies.set("access-token", data.access_token, "1d");
      // this.$cookies.set("refresh-token", data.refresh_token, "1d");
      // 일단은 자동 로그인 되지 않게 하기 위헤 세션에 저장
      sessionStorage.setItem("access-token", data.access_token);
      sessionStorage.setItem("refresh-token", data.refresh_token);
      await this.setUserInfo();
      this.$router.push({ name: "home" });
    },
    async setUserInfo() {
      const res = await getKakaoUserInfo();
      console.log(res);
      const userInfo = {
        id: res.kakao_account.profile.nickname,
        platform: "kakao"
      };
      // this.$store.commit("SET_USER_INFO", userInfo);
      this.SET_USER_INFO(userInfo);
      console.log(userInfo);
    }
  },

  created() {
    if (this.$route.query.code) {
      this.setKakaoToken();
    }
  }
};
</script>
