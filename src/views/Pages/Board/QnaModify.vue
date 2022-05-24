<template>
  <card>
    <b-row align-v="center" slot="header">
      <b-col cols="8">
        <!-- <h3 class="mb-0">{{ board.title }}</h3> -->
        <!-- <b-form-input v-model="text" placeholder="Enter your name"></b-form-input> -->
        <b-form-input v-model="board.title" placeholder="제목">{{
          board.title
        }}</b-form-input>
      </b-col>
      <b-col cols="4" class="text-right">
        <a href="#!" class="btn btn-sm btn-primary" @click="modifyBoard"
          >글수정</a
        >
        <a href="#!" class="btn btn-sm btn-primary" @click="onReset">초기화</a>
        <a href="#!" class="btn btn-sm btn-primary" @click="onExit">나가기</a>
      </b-col>
    </b-row>

    <b-form @submit.prevent="log()">
      <b-row>
        <b-col cols="4" class="text-left"> </b-col>
        <b-col cols="8" class="text-right"
          ><span class="heading-small text-muted "
            >등록일 : {{ board.registDate }}</span
          ></b-col
        >
      </b-row>
      <b-row>
        <b-col cols="4" class="text-right"> </b-col>
        <b-col cols="8" class="text-right"
          ><span class="heading-small text-muted "
            >수정일 : {{ board.updateDate }}</span
          ></b-col
        >
      </b-row>
      <b-row>
        <b-col cols="4" class="text-left"> </b-col>
        <b-col cols="8" class="text-right"
          ><span class="heading-small text-muted "
            >작성자 : {{ board.user_id }}</span
          ></b-col
        >
      </b-row>
      <hr class="my-4" />

      <div class="pl-lg-4 pl-6">
        <!-- <div class="pl-6">
          {{ board.content }}
        </div> -->
        <div class="pl-6 pr-7">
          <b-form-textarea
            rows="5"
            max-rows="15"
            v-model="board.content"
            placeholder="내용"
            >{{ board.content }}</b-form-textarea
          >
        </div>
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
        <!-- <div class="pl-6" style="background-color: #f9fafb;">
          <h6 class="heading-small text-muted mb-4"></h6>
          <comment-item :parentComment="comment"></comment-item>
          <div></div>
        </div> -->

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
import { getArticleCommentByBoardno } from "@/api/qna.js";
import http from "@/api/http";

import CommentItem from "@/views/Pages/Board/CommentItem.vue";
import moment from "moment";

export default {
  components: {
    CommentItem
  },
  data() {
    return {
      board: {
        no: 0,
        title: "",
        user_id: "",
        content: "",
        registDate: "",
        updateDate: ""
      },
      comment: {
        no: 0,
        registDate: "",
        updateDate: "",
        content: ""
      }
    };
  },
  computed: {
    messageContent() {
      if (this.board.content)
        return this.board.content.split("\n").join("<br>");
      return "";
    }
  },

  methods: {
    log() {
      console.log(this.board.no);
    },
    listBoard() {
      this.$router.push({ name: "qnaList" });
    },
    deleteBoard() {
      if (confirm("정말로 삭제하시겠습니까?")) {
        this.$router.push({
          name: "boardDelete",
          params: { boardno: this.board.no }
        });
      }
    },
    modifyBoard() {
      http
        .put(`/qna/${this.board.no}`, {
          title: this.board.title,
          content: this.board.content
        })
        .then(({ data }) => {
          let msg = "수정 처리시 문제가 발생했습니다.";
          if (data === "success") {
            msg = "수정이 완료되었습니다.";
          }
          alert(msg);
          this.moveList();
        });
    },
    onReset(event) {
      event.preventDefault();
      this.board.title = "";
      this.board.content = "";
    },
    onExit(event) {
      event.preventDefault();
      this.$router.push({ name: "qnaList" });
    },
    moveList() {
      console.log("무브리스트");
      this.$router
        .push({
          name: "boardDetail",
          params: { boardno: this.board.no }
        })
        .catch(err => {});
    }
  },
  created() {
    getArticleCommentByBoardno(
      this.$route.params.boardno,
      response => {
        console.log(response);
        this.board = response.data;
        this.comment.no = this.$route.params.boardno;

        let registDate = moment(this.board.registDate)
          .add(-9, "h")
          .format("yyyy.MM.DD LT");
        let updateDate = moment(this.board.updateDate)
          .add(-9, "h")
          .format("yyyy.MM.DD LT");

        this.board.registDate = registDate;
        this.board.updateDate = updateDate;

        // this.comment.registDate =
        //   response.data.comment_registDate == null ? "" : registDate;
        // this.comment.updateDate =
        //   response.data.comment_updateDate == null ? "" : updateDate;
        // this.comment.content =
        //   response.data.comment_content == null
        //     ? ""
        //     : response.data.comment_content;
      },
      () => {}
    );
  }
  // filters: {
  //   dateFormat(time) {
  //     return moment(new Date(time)).format("YY.MM.DD hh:mm:ss");
  //   },
  // },
};
</script>
<style></style>
