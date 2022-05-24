<template>
  <card>
    <b-row align-v="center" slot="header"> </b-row>

    <b-form @submit.prevent="log()">
      <div class="pl-lg-4">
        <!-- <b-row>
          <b-col lg="6">
            <base-input
              type="text"
              label="Username"
              placeholder="Username"
              v-model="user.username"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="email"
              label="Email address"
              placeholder="mike@email.com"
              v-model="user.email"
            >
            </base-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col lg="6">
            <base-input
              type="text"
              label="First Name"
              placeholder="First Name"
              v-model="user.firstName"
            >
            </base-input>
          </b-col>
          <b-col lg="6">
            <base-input
              type="text"
              label="Last Name"
              placeholder="Last Name"
              v-model="user.lastName"
            >
            </base-input>
          </b-col>
        </b-row> -->
      </div>
      <hr class="my-4" />

      <!-- Address -->

      <div class="pl-lg-4">
        <div class="pl-6" style="background-color: #f9fafb;">
          <h6 class="heading-small text-muted mb-4"></h6>
          <h3 class="heading-small text-muted  text-center">삭제처리중...</h3>
          <!-- <b-col><b-alert show variant="danger">삭제처리중...</b-alert></b-col> -->

          <div></div>
        </div>

        <!-- <b-row>
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
        </b-row> -->
      </div>

      <!-- <hr class="my-4" v-if="comment.content" /> -->
    </b-form>
  </card>
</template>
<script>
import { deleteArticle } from "@/api/qna.js";
import CommentItem from "@/views/Pages/Board/CommentItem.vue";
import moment from "moment";

export default {
  created() {
    // http.delete(`/qna/${this.$route.params.boardno}`).then(() => {
    //   this.$router.push({ name: "qnaList" });
    // });
    deleteArticle(this.$route.params.boardno, response => {
      this.$router.push({ name: "qnaList" });
    });
  }
  // components: {
  //   CommentItem
  // },
  // data() {
  //   return {
  //     board: {
  //       no: 0,
  //       title: "",
  //       user_id: "",
  //       content: "",
  //       registDate: "",
  //       updateDate: ""
  //     },
  //     comment: {
  //       no: 0,
  //       registDate: "",
  //       updateDate: "",
  //       content: ""
  //     }
  //   };
  // },
  // computed: {
  //   messageContent() {
  //     if (this.board.content)
  //       return this.board.content.split("\n").join("<br>");
  //     return "";
  //   }
  // },
  // methods: {
  //   log() {
  //     console.log(this.$route.params.boardno);
  //   },
  //   listBoard() {
  //     this.$router.push({ name: "qnaList" });
  //   },
  //   moveModifyBoard() {
  //     this.$router.replace({
  //       name: "boardModify",
  //       params: { boardno: this.board.no }
  //     });
  //   },
  //   deleteBoard() {
  //     if (confirm("정말로 삭제?")) {
  //       this.$router.replace({
  //         name: "boardDelete",
  //         params: { boardno: this.board.no }
  //       });
  //     }
  //   }
  // },
  // created() {
  //   getArticleCommentByBoardno(
  //     this.$route.params.boardno,
  //     response => {
  //       console.log(response);
  //       this.board = response.data;
  //       this.comment.no = this.$route.params.boardno;
  //       let registDate = moment(this.board.registDate)
  //         .add(-9, "h")
  //         .format("yyyy.MM.DD LT");
  //       let updateDate = moment(this.board.updateDate)
  //         .add(-9, "h")
  //         .format("yyyy.MM.DD LT");
  //       this.board.registDate = registDate;
  //       this.board.updateDate = updateDate;
  //       this.comment.registDate =
  //         response.data.comment_registDate == null ? "" : registDate;
  //       this.comment.updateDate =
  //         response.data.comment_updateDate == null ? "" : updateDate;
  //       this.comment.content =
  //         response.data.comment_content == null
  //           ? ""
  //           : response.data.comment_content;
  //     },
  //     () => {}
  //   );
  // }
  // filters: {
  //   dateFormat(time) {
  //     return moment(new Date(time)).format("YY.MM.DD hh:mm:ss");
  //   },
  // },
};
</script>
<style></style>
