<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <b-row align-v="center">
        <b-col cols="8">
          <h3 class="mb-0">QnA 게시판</h3>
        </b-col>
        <b-col cols="4" class="text-right">
          <a
            href="#!"
            class="btn btn-sm btn-primary"
            @click="moveWrite"
            >글쓰기</a
          >
        </b-col>
      </b-row>
    </b-card-header>

    <el-table
      class="table-responsive table"
      header-row-class-name="thead-light"
      :data="boards"
      @row-click="viewBoard"
      style="cursor: pointer;"
    >
      <el-table-column
        :label="this.fields[0].label"
        prop="budget"
        min-width="140px"
      >
        <!-- 글번호 -->
        <template v-slot="{ row }">{{ row.no }} </template>
      </el-table-column>

      <el-table-column
        :label="this.fields[1].label"
        min-width="310px"
        prop="name"
      >
        <template v-slot="{ row }">
          <b-media no-body class="align-items-center">
            <b-media-body>
              <span class="font-weight-600 name mb-0 text-sm">{{
                row.title
              }}</span>
            </b-media-body>
          </b-media>
        </template>
      </el-table-column>

      <el-table-column
        :label="this.fields[2].label"
        min-width="170px"
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
        <template v-slot="{ row }">{{ row.user_id }} </template>
      </el-table-column>

      <el-table-column :label="this.fields[3].label" min-width="190px">
        <!-- 작성일 -->
        <template v-slot="{ row }">{{ row.registDate }} </template>
      </el-table-column>

      <el-table-column
        :label="this.fields[4].label"
        prop="completion"
        min-width="240px"
      >
        <template v-slot="{ row }">
          <badge class="badge-dot mr-4" type="">
            <i :class="`bg-${row.statusType}`"></i>
            <span class="status" :class="`text-${row.statusType}`">{{
              row.comment_content
            }}</span>
          </badge>
        </template>
      </el-table-column>
    </el-table>

    <b-card-footer class="py-4 d-flex justify-content-end">
      <!-- <base-pagination
        v-model="curPageNum"
        :per-page="10"
        :total="50"
      ></base-pagination> -->
      <b-pagination v-model="curPageNum"
            :total-rows="totalRows"
            :per-page="pageSize"
            first-number
            align="center"
            @change="pageClick"></b-pagination>
    </b-card-footer>
  </b-card>
</template>
<script>
import projects from "../projects";
import { Table, TableColumn } from "element-ui";
import { getList } from "@/api/qna.js";
import moment from "moment";
import { mapMutations, mapState } from "vuex";
import {getListByPaging} from "@/api/qna.js"

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
      pages: null,
      boards: [],
      fields: [
        { key: "no", label: "글번호", tdClass: "tdClass" },
        { key: "title", label: "제목", tdClass: "tdSubject" },
        { key: "user_id", label: "작성자", tdClass: "tdClass" },
        { key: "registDate", label: "작성일", tdClass: "tdClass" },
        { key: "comment_content", label: "답변", tdClass: "tdClass" }
      ]
    };
  },
  computed: {
    ...mapState("userStore", ["isLogin"])
    
  },
  created() {
    // getList(
    //   ({ data }) => {
    //     data.forEach(board => {
    //       board.registDate = moment(board.registDate)
    //         .add(-9, "h")
    //         .format("yyyy.MM.DD LT");
    //       board.comment_content =
    //         board.comment_content == null ? "답변대기" : "답변완료";
    //       if (board.comment_content === "답변완료") {
    //         board.statusType = "success";
    //       } else {
    //         board.statusType = "warning";
    //       }
    //       this.boards.push(board);
    //     });
    //     console.log(this.boards);
    //   },
    //   () => {}
    // );
    //  getListByPaging({
    //     pageNum: 1,
    //     pageSize: 10
    //   },(response)=>{


    //     this.board = response.data[0]
    //     console.log(response.data[0]);
    //   })
    getListByPaging({
        pageNum: 1,
        pageSize: 10
      },(response)=>{
        console.log(response.data.total);
        this.totalRows = response.data.total;
        // this.boards = response.data.list;
        //         this.pages = response.data.total;

        response.data.list.forEach(board => {
          board.registDate = moment(board.registDate)
            .add(-9, "h")
            .format("yyyy.MM.DD LT");
          board.comment_content =
            board.comment_content == null ? "답변대기" : "답변완료";
          if (board.comment_content === "답변완료") {
            board.statusType = "success";
          } else {
            board.statusType = "warning";
          }
          this.boards.push(board);
        });
      });
  },

  methods: {
    ...mapMutations("qnaStore", ["SET_BOARDNO"]),
    moveWrite() {
      if (this.isLogin) {
        this.$router.push({ name: "boardRegister" });
      } else {
        alert("로그인을 먼저 진행해주세요.");
      }
    },
    viewBoard(board) {
      console.log(board.no);
      this.SET_BOARDNO(board.no);
      this.$router.push({
        name: "boardDetail",
        params: { boardno: board.no }
      });
    },
    log() {
      console.log(this.boards);
    },
    pageClick(event) {
      let pageNum = event;
      let pageSize = 10;
      this.boards = [],
      getListByPaging({pageNum,pageSize},(response)=>{
        response.data.list.forEach(board => {
          board.registDate = moment(board.registDate)
            .add(-9, "h")
            .format("yyyy.MM.DD LT");
          board.comment_content =
            board.comment_content == null ? "답변대기" : "답변완료";
          if (board.comment_content === "답변완료") {
            board.statusType = "success";
          } else {
            board.statusType = "warning";
          }
          this.boards.push(board);
        });
      })
    }
  }
};
</script>
