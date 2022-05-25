<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <b-container class="container">
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="5" lg="6" md="8" class="px-5">
              <h1 class="text-white">회원가입</h1>
              <!-- <p class="text-lead text-white">Use these awesome forms to login or create new account in your project for
                free.</p> -->
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
      <!-- Table -->
      <b-row class="justify-content-center">
        <b-col lg="6" md="8">
          <b-card no-body class="bg-secondary border-0">
            <b-card-header class="bg-transparent pb-5">
              <div class="text-muted text-center mt-2 mb-4">
                <!-- <small>Sign up with</small> -->
              </div>
              <div class="text-center">
                <a href="#" class="btn btn-neutral btn-icon mr-4">
                  <span class="btn-inner--icon"
                    ><img src="img/icons/common/kakaologo.jpg"
                  /></span>
                  <span class="btn-inner--text" @click="kakaoSignUp">카카오톡으로 회원가입</span>
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
                <small>다른 방법으로 회원가입</small>
              </div>
              <validation-observer
                v-slot="{ handleSubmit }"
                ref="formValidator"
              >
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-hat-3"
                    placeholder="id"
                    name="id"
                    :rules="{ required: true }"
                    v-model="model.id"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-lock-circle-open"
                    placeholder="password"
                    type="password"
                    name="Password"
                    :rules="{ required: true }"
                    v-model="model.password"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-hat-3"
                    placeholder="Name"
                    name="name"
                    :rules="{ required: true }"
                    v-model="model.name"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-email-83"
                    placeholder="Email"
                    name="address"
                    :rules="{ required: true }"
                    v-model="model.address"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-email-83"
                    placeholder="phone"
                    name="phone"
                    :rules="{ required: true }"
                    v-model="model.phone"
                  >
                  </base-input>

                  <base-input
                    alternative
                    class="mb-3"
                    prepend-icon="ni ni-email-83"
                    placeholder="favorite"
                    name="favorite"
                    :rules="{ required: true }"
                    v-model="model.favorite"
                  >
                  </base-input>

                  <!-- <div class="text-muted font-italic">
                    <small
                      >password strength:
                      <span class="text-success font-weight-700"
                        >strong</span
                      ></small
                    >
                  </div> -->
                  <b-row class=" my-4">
                    <b-col cols="12">
                      <!-- <base-input
                        :rules="{ required: { allowFalse: false } }"
                        name="Privacy"
                        Policy
                      >
                        <b-form-checkbox v-model="model.agree">
                          <span class="text-muted"
                            >I agree with the
                            <a href="#!">Privacy Policy</a></span
                          >
                        </b-form-checkbox>
                      </base-input> -->
                    </b-col>
                  </b-row>
                  <div class="text-center">
                    <b-button type="submit" variant="primary" class="mt-4"
                      >회원가입</b-button
                    >
                  </div>
                </b-form>
              </validation-observer>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { signUp, findByKakaoId } from "@/api/user.js";
import { getKakaoToken, getKakaoUserInfo } from "@/services/kakaoLogin";

export default {
  name: "register",
  data() {
    return {
      model: {
        id: "",
        name: "",
        adress: "",
        phone: "",
        favorite: "",
        password: ""
        // agree: false
      },
      token:{
        access_token: "",
        refresh_token: "",
      }
    };
  },
  methods: {
    onSubmit() {
      signUp(
        this.model,
        response => {
          if (response.data.message === "success") {
            alert("회원가입이 완료되었습니다.");
            this.$router.push({ name: "login" });
          } else if (response.data.message === "similarlity") {
            alert("아이디와 비밀번호의 유사도가 높습니다.");
          } else {
            alert("회원가입이 실패했습니다.");
          }
        },
        fail => {
          console.log(fail);
        }
      );
      // http.post("/singUp", model).then(res => {
      //   console.log(res);
      // });
      // this will be called only after form is valid. You can do an api call here to register users
    },
    kakaoSignUp(){ 
      const param = {
        redirectUri: "http://localhost:8080/register"
      };
      window.Kakao.Auth.authorize(param);
    },
    async setKakaoToken() {
      console.log("카카오 인증 코드", this.$route.query.code);
      const { data } = await getKakaoToken(this.$route.query.code, "http://localhost:8080/register");
      if (data.error) {
        alert("카카오톡 로그인 오류입니다.");
        this.$router.go();
        return;
      }
      window.Kakao.Auth.setAccessToken(data.access_token);
      this.token.access_token = data.access_token;
      this.token.refresh_token = data.refresh_token;
      // this.$cookies.set("access-token", data.access_token, "1d");
      // this.$cookies.set("refresh-token", data.refresh_token, "1d");
      // 일단은 자동 로그인 되지 않게 하기 위헤 세션에 저장
      // sessionStorage.setItem("access-token", data.access_token);
      // sessionStorage.setItem("refresh-token", data.refresh_token);
      await this.setUserInfo();
      // this.$router.push({ name: "home" });
    },
    async setUserInfo() {
      const res = await getKakaoUserInfo();
      console.log(res);
      const admin_str = "vsbvgih24rn23gf6vsdv12b12sd";
      const userInfo = {
        id: res.id,
        name: res.kakao_account.profile.nickname,
        address: res.kakao_account.email,

        platform: "kakao"
      };
      // this.$store.commit("SET_USER_INFO", userInfo);
      await findByKakaoId(userInfo.id,({data})=>{
        console.log("여기를 확인해라");
        console.log(data);
        if(data.userId != null){
            alert("이미 가입되어있는 회원입니다. 로그인을 진행해주세요.");
            this.$router.push({ name: "login" });

        }else{
          signUp(
        {
        id: userInfo.id,
        name: userInfo.name,
        address: "kakao",
        phone: "",
        favorite: "",
        password: userInfo.id+admin_str,
        // agree: false
      },
        response => {
          if (response.data.message === "success") {
            sessionStorage.setItem("access-token", data.access_token);
      sessionStorage.setItem("refresh-token", data.refresh_token);
                this.SET_USER_INFO(userInfo);

            alert("회원가입과 로그인이 완료되었습니다.");

            this.$router.push({ name: "login" });
          } else if (response.data.message === "similarlity") {
            alert("아이디와 비밀번호의 유사도가 높습니다.");
          } else {
            alert("회원가입이 실패했습니다.");
          }
        },
        fail => {
          console.log(fail);
        }
      );
        }
      })
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
<style></style>
