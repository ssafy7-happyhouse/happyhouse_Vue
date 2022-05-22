<template>
  <div>
    <div
      class="header pb-8 pt-5 pt-lg-8 d-flex align-items-center profile-header"
      style="min-height: 300px; background-image: url(img/theme/profile-cover.jpg); background-size: cover; background-position: center top;"
    >
      <!-- <b-container fluid> -->
      <!-- Mask -->
      <span class="mask bg-gradient-success "></span>
      <!-- Header container -->
      <!-- <b-container fluid class="d-flex align-items-center">
          <b-row>
            <b-col lg="7" md="10">
              <h1 class="display-2 text-white">
                안녕하세요 {{ userInfo.id }}님!
              </h1>
              <p class="text-white mt-0 mb-5">
                안녕하세요 {{ userInfo.id }}님! You can see the progress you've made
                with your work and manage your projects or assigned tasks
              </p>
              <a href="#!" class="btn btn-info">Edit profile</a>
            </b-col>
          </b-row>
        </b-container>
      </b-container> -->
    </div>

    <b-container fluid class="mt--6">
      <b-row>
        <!-- <b-col xl="4" class="order-xl-2 mb-5"> -->
        <!-- <user-card></user-card> -->
        <!-- </b-col>
        <b-col xl="8" class="order-xl-1">
        </b-col> -->
        <b-col style="margin-left:10%; margin-right:10%;">
          <edit-kakao-profile-form
            v-if="userInfo.platform"
          ></edit-kakao-profile-form>
          <edit-profile-form v-else></edit-profile-form>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapState } from "vuex";
import EditProfileForm from "./UserProfile/EditProfileForm.vue";
import EditKakaoProfileForm from "./UserProfile/EditKakaoProfileForm.vue";
import UserCard from "./UserProfile/UserCard.vue";
//UserCard 는 지워도 될듯

export default {
  components: {
    EditProfileForm,
    UserCard,
    EditKakaoProfileForm
  },
  computed: {
    ...mapState("userStore", ["userInfo"])
  },
  created() {
    alert(userInfo);
  }
};
</script>
<style></style>
