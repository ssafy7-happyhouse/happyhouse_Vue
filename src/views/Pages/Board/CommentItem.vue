<template>
  <b-row class="mb-1">
    <b-row
      class="mb-1"
      v-if="parentComment.content.length == 0 && adminCheck()"
      style="width:100%;"
    >
      <b-form-group
        id="content-group"
        label="내용:"
        label-for="content"
        style="width:90%;"
      >
        <b-form-textarea
          id="regist_content"
          v-model="content"
          ref="regist_content"
          placeholder="내용 입력..."
          rows="10"
          max-rows="15"
        ></b-form-textarea>
        <b-button variant="outline-primary" class="m-1" @click="onSubmit"
          >답변 등록</b-button
        >
      </b-form-group>
    </b-row>
    <div v-else-if="parentComment.content.length != 0" style="width:90%;">
      <div v-if="!modifyFlag" class="parentComment">
        <b-row class="mb-1">
          <b-col>
            <b-card title="답변">
              <b-card-text v-model="content"
                >{{ this.parentComment.content }}
              </b-card-text>
            </b-card>

            <!-- <b-card
              :header-html="
                `<h4>답변</h4>
          <div><h6>등록일 : ${parentComment.registDate} </h6></div>
          <div><h6>수정일 : ${parentComment.updateDate} </h6></div>`
              "
              class="mb-2"
              border-variant="dark"
              no-body
            >
              <b-card-body class="text-left">
                <div v-html="messageCommentContent"></div>
              </b-card-body>
            </b-card> -->
          </b-col>
        </b-row>

        <b-col class="mb-1" v-if="adminCheck()">
          <b-button variant="outline-info" class="m-1" @click="changeFlag"
            >답변 수정</b-button
          >
          <b-button variant="outline-danger" class="m-1" @click="deleteComment"
            >답변 삭제</b-button
          >
        </b-col>

        <div class="text-right heading-small">
          {{ parentComment.updateDate }}
        </div>
      </div>

      <div v-else>
        <b-form-textarea
          id="update_contentent"
          v-model="content"
          ref="update_contentent"
          placeholder="답변 입력..."
          rows="10"
          max-rows="15"
        ></b-form-textarea>
        <b-button
          type="submit"
          variant="outline-primary"
          class="m-1"
          @click="onSubmit"
          >글수정</b-button
        >
        <b-button type="warning" variant="warning" class="m-1" @click="onExit"
          >나가기</b-button
        >
      </div>
    </div>
  </b-row>
</template>

<script>
import http from "@/api/http";
import jwt_decode from "jwt-decode";

export default {
  name: "CommentItem",
  data() {
    return {
      content: "",
      modifyFlag: false
    };
  },
  props: {
    parentComment: { type: Object }
  },
  created() {
    this.content = this.parentComment.content;
  },
  computed: {
    messageCommentContent() {
      if (this.parentComment.content)
        return this.parentComment.content.split("\n").join("<br>");
      return "";
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      let err = true;
      let msg = "";
      !this.content &&
        ((msg = "내용 입력해주세요"),
        (err = false),
        this.modifyFlag
          ? this.$refs.regist_content.focus()
          : this.$refs.update_content.focus());
      if (!err) alert(msg);
      else this.modifyFlag ? this.modifyComment() : this.registComment();
    },

    registComment() {
      http
        .post(`/qna/${this.parentComment.no}/comment`, {
          content: this.content
        })
        .then(({ data }) => {
          let msg = "등록 처리시 문제가 발생했습니다.";
          if (data === "success") {
            msg = "등록이 완료되었습니다.";
          }
          console.log(data);
          this.parentComment.content = this.content;

          this.moveList();
        });
    },
    modifyComment() {
      http
        .put(`/qna/${this.parentComment.no}/comment`, {
          content: this.content
        })
        .then(({ data }) => {
          let msg = "수정 처리시 문제가 발생했습니다.";
          if (data === "success") {
            msg = "수정이 완료되었습니다.";
          }
          alert(msg);
          this.parentComment.content = this.content;

          // this.$router.go();
          this.modifyFlag = false;

          this.moveList();
          // this.$router.go(this.$router.currentRoute);
        });
    },
    deleteComment() {
      http.delete(`/qna/${this.parentComment.no}/comment`).then(({ data }) => {
        let msg = "삭제 처리시 문제가 발생했습니다.";
        if (data === "success") {
          msg = "삭제가 완료되었습니다.";
        }
        alert(msg);
        this.moveList();
      });
    },
    moveList() {
      // this.$router.push({ name: "boardDetail", params: { boardno: no } });
      console.log("무브리스트");
      this.$router
        .push({
          name: "boardDetail",
          params: { boardno: this.parentComment.no }
        })
        .catch(err => {});
    },
    onExit(event) {
      event.preventDefault();
      this.modifyFlag = false;
    },
    adminCheck() {
      return false;
    },
    changeFlag() {
      this.modifyFlag = true;
      this.content = this.parentComment.content;
    },
    userCheck() {
      let token = response.data["access-token"];
      let decode_token = jwt_decode(token);
      if (decode_token.userid == "admin") {
        return true;
      } else {
        return false;
      }
    },
    hasComment() {
      if (this.content) {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style></style>
