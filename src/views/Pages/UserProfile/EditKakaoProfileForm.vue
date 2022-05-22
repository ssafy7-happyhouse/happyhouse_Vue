<template>
  <card>
    <b-row align-v="center" slot="header">
      <b-col cols="8">
        <h3 class="mb-0">마이 페이지</h3>
      </b-col>
      <b-col cols="4" class="text-right">
        <!-- <a href="#!" class="btn btn-sm btn-primary" @click="updateProfile"
          >수정</a
        > -->
      </b-col>
    </b-row>

    <b-form>
      <h6 class="heading-small text-muted mb-4" style="margin-top:10px;"></h6>

      <div class="pl-lg-4">
        <b-col lg="3" class="order-lg-2">
          <div class="card-profile-image">
            <a href="#">
              <b-img src="img/theme/lionLogo.png" rounded="circle" />
            </a>
          </div>
        </b-col>
        <b-row>
          <b-col lg="6">
            <!-- <base-input
              type="text"
              label="아이디"
              placeholder="사용자 아이디"
              v-model="user.id"
              readonly
            >
            </base-input> -->
          </b-col>
          <b-col lg="6" style="margin-bottom:20px;">
            <base-input
              type="text"
              label="사용자 이름"
              placeholder="이름"
              v-model="userInfo.id"
              readonly
            >
            </base-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="6">
            <!-- <base-input
              type="text"
              label="사용자 이메일"
              placeholder="email"
              v-model="user.address"
            >
            </base-input> -->
          </b-col>
          <b-col lg="6">
            <!-- <base-input
              type="text"
              label="사용자 전화번호"
              placeholder="전화번호"
              v-model="user.phone"
            >
            </base-input> -->
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
import { mapState } from "vuex";

export default {
  data() {
    return {
      user: {
        id: ""
      }
    };
  },
  computed: {
    ...mapState("userStore", ["userInfo"])
  }
};
</script>
<style></style>
