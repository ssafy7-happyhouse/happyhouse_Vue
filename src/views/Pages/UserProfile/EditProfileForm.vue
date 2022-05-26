<template>
  <card>
    <b-row align-v="center" slot="header">
      <b-col cols="8">
        <h3 class="mb-0">마이 페이지</h3>
      </b-col>
      <b-col cols="4" class="text-right">
        <a href="#!" class="btn btn-sm btn-primary" @click="updateProfile"
          >수정</a
        >
        <a
          href="#!"
          class="btn btn-sm btn-primary"
          @click="deleteProfile(user.id)"
          >탈퇴</a
        >
      </b-col>
    </b-row>

    <b-form>
      <h6 class="heading-small text-muted mb-4">사용자 정보</h6>

      <div class="pl-lg-4">
        <b-row>
          <b-col lg="6">
            <base-input
              type="text"
              label="아이디"
              placeholder="사용자 아이디"
              v-model="user.id"
              readonly
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="text"
              label="사용자 이름"
              placeholder="이름"
              v-model="user.name"
            >
            </base-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="6">
            <base-input
              type="text"
              label="사용자 이메일"
              placeholder="email"
              v-model="user.address"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="text"
              label="사용자 전화번호"
              placeholder="전화번호"
              v-model="user.phone"
            >
            </base-input>
          </b-col>
        </b-row>
      </div>
      <!-- <hr class="my-4" /> -->

      <!-- Address -->
      <!-- <h6 class="heading-small text-muted mb-4">Contact information</h6> -->

      <!-- <div class="pl-lg-4">
        <b-row>
          <b-col md="12">
            <base-input
              type="text"
              label="Address"
              placeholder="Home Address"
              v-model="user.address"
            >
            </base-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="4">
            <base-input
              type="text"
              label="City"
              placeholder="City"
              v-model="user.city"
            >
            </base-input>
          </b-col>
          <b-col lg="4">
            <base-input
              type="text"
              label="Country"
              placeholder="Country"
              v-model="user.country"
            >
            </base-input>
          </b-col>
          <b-col lg="4">
            <base-input
              label="Postal Code"
              placeholder="ZIP Code"
              v-model="user.postalCode"
            >
            </base-input>
          </b-col>
        </b-row>
      </div> -->

      <!-- <hr class="my-4" /> -->
      <!-- Description -->
      <!-- <h6 class="heading-small text-muted mb-4">About me</h6>
      <div class="pl-lg-4">
        <b-form-group
          label="About Me"
          label-class="form-control-label"
          class="mb-0"
          label-for="about-form-textaria"
        > -->
      <!--  <label class="form-control-label">About Me</label> -->
      <!-- <b-form-textarea
            rows="4"
            value="A beautiful premium dashboard for BootstrapVue."
            id="about-form-textaria"
            placeholder="A few words about you ..."
          ></b-form-textarea>
        </b-form-group>
      </div> -->
    </b-form>
  </card>
</template>
<script>
import { findById, updateMyInfo } from "@/api/user";
import jwt_decode from "jwt-decode";
import { deleteUserById } from "@/api/user";
import { mapMutations, mapState } from "vuex";
const userStore = "userStore";

export default {
  data() {
    return {
      user: {
        id: "",
        name: "",
        address: "",
        phone: ""
      }
    };
  },
  computed: {
    ...mapState(userStore, ["userInfo"])
  },
  methods: {
    ...mapMutations(userStore, ["SET_IS_LOGIN", "SET_USER_INFO"]),
    updateProfile() {
      updateMyInfo(
        this.user,
        ({ data }) => {
          let msg = "";
          if (data.message == success) {
            msg = "회원정보 수정이 성공했습니다.";
          } else {
            msg = "회원정보 수정이 실패했습니다. 다시 시도해주세요.";
          }
          alert(msg);
          // this.$router.go();
        },
        () => {}
      );
      // alert("Your data: " + JSON.stringify(this.user));
    },
    // 왜 안돼..?
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
    },
    deleteProfile(id) {
      console.log(id);
      var result = confirm("정말 탈퇴하시겠습니까?");
      if (result) {
        deleteUserById(id, ({ data }) => {
          if (data.message == "success") {
            alert("회원이 삭제되었습니다.");
          } else {
            alert("오류가 발생했습니다.");
          }
        });
        this.logout();
      }
    }
  },
  created() {
    let decode_token = jwt_decode(sessionStorage.getItem("access-token"));
    findById(
      decode_token.userid,
      ({ data }) => {
        this.user.id = data.userInfo.id;
        this.user.name = data.userInfo.name;
        this.user.address = data.userInfo.address;
        this.user.phone = data.userInfo.phone;
        console.log(data);
      },
      () => {}
    );
  }
};
</script>
<style></style>
