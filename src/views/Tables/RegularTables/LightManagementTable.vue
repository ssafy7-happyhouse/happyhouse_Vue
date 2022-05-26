<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <b-row align-v="center">
        <b-col cols="8">
          <h3 class="mb-0">회원 관리</h3>
        </b-col>
        <b-col cols="4" class="text-right">
          <!-- <a href="#!" class="btn btn-sm btn-primary">글쓰기</a> -->
        </b-col>
      </b-row>
    </b-card-header>

    <el-table
      class="table-responsive table"
      header-row-class-name="thead-light"
      :data="users"
      @row-click="viewUser"
      style="cursor: pointer;"
    >
      <el-table-column
        :label="this.fields[0].label"
        prop="budget"
        min-width="170px"
      >
        <!-- 글번호 -->
        <template v-slot="{ row }">{{ row.id }} </template>
      </el-table-column>

      <el-table-column
        :label="this.fields[1].label"
        min-width="170px"
        prop="name"
      >
        <template v-slot="{ row }">
          <b-media no-body class="align-items-center">
            <b-media-body>
              <span class="font-weight-600 name mb-0 text-sm">{{
                row.name
              }}</span>
            </b-media-body>
          </b-media>
        </template>
      </el-table-column>

      <el-table-column
        :label="this.fields[2].label"
        min-width="200px"
        prop="status"
      >
        <!-- <template v-slot="{ row }">
          <badge class="badge-dot mr-4" type="">
            <i :class="`bg-${row.statusType}`"></i>
            <span class="status" :class="`text-${row.statusType}`">{{
              row.status
            }}</span>
          </badge>
        </template> -->
        <!-- 작성자 -->
        <template v-slot="{ row }">{{ row.address }} </template>
      </el-table-column>

      <el-table-column :label="this.fields[3].label" min-width="190px">
        <!-- 작성일 -->
        <template v-slot="{ row }">{{ row.phone }} </template>
      </el-table-column>

      <el-table-column
        :label="this.fields[4].label"
        prop="completion"
        min-width="240px"
      >
        <template v-slot="{ row }">
          {{ row.favorite }}
        </template>
      </el-table-column>

      <el-table-column label="관리" min-width="150px">
        <template v-slot="{ row }">
          <a
            href="#!"
            class="btn btn-sm btn-primary"
            @click="deleteUser(row.id)"
            v-if="!adminCheck(row.id)"
            >삭제</a
          >
        </template>

        <!-- 작성일 -->
      </el-table-column>

      <!-- <el-table-column
        :label="this.fields[5].label"
        min-width="170px"
        prop="status"
      > -->
      <!-- 관심 지역 -->
      <!-- <template v-slot="{ row }">{{ row.user_id }} </template>
      </el-table-column> -->
    </el-table>

    <b-card-footer class="py-4 d-flex justify-content-end">
      <!-- <base-pagination
        v-model="curPageNum"
        :per-page="10"
        :total="50"
      ></base-pagination> -->
      <b-pagination
        v-model="curPageNum"
        :total-rows="totalRows"
        :per-page="pageSize"
        first-number
        align="center"
        @change="pageClick"
      ></b-pagination>
    </b-card-footer>
  </b-card>
</template>
<script>
import projects from "../projects";
import { Table, TableColumn } from "element-ui";
import {
  getUserListByPaging,
  getCountArticleById,
  deleteAllBoardById
} from "@/api/management";
import { deleteUserById } from "@/api/user";
import { mapState } from "vuex";

import moment from "moment";

export default {
  name: "light-table",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      projects,
      curPageNum: 1,
      pageSize: 10,
      totalRows: 0,
      users: [],
      fields: [
        // { key: "no", label: "사용자 번호", tdClass: "tdClass" },
        { key: "title", label: "아이디", tdClass: "tdSubject" },
        { key: "user_id", label: "이름", tdClass: "tdClass" },
        { key: "registDate", label: "이메일", tdClass: "tdClass" },
        { key: "comment_content", label: "전화번호", tdClass: "tdClass" },
        { key: "comment_content", label: "관심 지역", tdClass: "tdClass" }
      ]
    };
  },

  computed: {
    ...mapState("userStore", ["userInfo"])
  },
  methods: {
    viewUser() {},
    adminCheck(id) {
      if (id == null) {
        return false;
      }
      if (id == "admin") {
        return true;
      } else {
        return false;
      }
    },
    async deleteUser(id) {
      // console.log(id);
      // 해당 유저가 쓴 글이 있는지,
      await getCountArticleById(id, ({ data }) => {
        if (data.message == "success") {
          deleteAllBoardById(id, ({ data }) => {
            if (data.message == "success") {
              alert("사용자가 작성한 글을 모두 삭제하였습니다.");
              this.delete(id);
            } else {
              this.delete(id);
            }
          });
        } else {
          this.delete(id);
        }
      });

      // deleteUserById(id, ({ data }) => {
      //   if (data.message == "success") {
      //     alert("회원이 삭제되었습니다.");
      //   } else {
      //     alert("오류가 발생했습니다.");
      //   }

      //   this.$router.go();
      // });
    },
    delete(id) {
      deleteUserById(id, ({ data }) => {
        if (data.message == "success") {
          alert("회원이 삭제되었습니다.");
        } else {
          alert("오류가 발생했습니다.");
        }

        this.$router.go();
      });
    },
    pageClick(event) {
      let pageNum = event;
      let pageSize = 10;
      this.users = [];
      getUserListByPaging({ pageNum, pageSize }, response => {
        // response.data.list.forEach(board => {
        //   board.registDate = moment(board.registDate)
        //     .add(-9, "h")
        //     .format("yyyy.MM.DD LT");
        //   board.comment_content =
        //     board.comment_content == null ? "답변대기" : "답변완료";
        //   if (board.comment_content === "답변완료") {
        //     board.statusType = "success";
        //   } else {
        //     board.statusType = "warning";
        //   }
        //   this.boards.push(board);
        // });
        response.data.list.forEach(user => {
          this.users.push(user);
        });
      });
    }
  },
  created() {
    getUserListByPaging(
      {
        pageNum: 1,
        pageSize: 10
      },
      response => {
        console.log(response);
        this.totalRows = response.data.total;
        // this.boards = response.data.list;
        //         this.pages = response.data.total;

        response.data.list.forEach(user => {
          // user.registDate = moment(user.registDate)
          //   .add(-9, "h")
          //   .format("yyyy.MM.DD LT");
          // user.comment_content =
          //   user.comment_content == null ? "답변대기" : "답변완료";
          // if (user.comment_content === "답변완료") {
          //   user.statusType = "success";
          // } else {
          //   user.statusType = "warning";
          // }
          console.log(user);
          this.users.push(user);
        });
      }
    );
  }
};
</script>
