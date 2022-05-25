<template>
  <b-card no-body>
    <b-card-header class="border-0">
      <h3 class="mb-0">News</h3>
    </b-card-header>
    <div style="margin :40px">
      <div v-for="(news, index) in this.newsList" :key="index">
        <b-row>
          <b-col>
            <b-jumbotron>
              <template #header>{{ news.title_1 }}</template>

              <template #lead>
                <b-link :href="news.link_1" target="_blank">바로가기</b-link>
              </template>

              <hr class="my-4" />

              <p>
                {{ news.description_1 }}
              </p>
              <p>
                {{ news.pubDate_1 }}
              </p>
            </b-jumbotron></b-col
          >
          <b-col>
            <b-jumbotron>
              <template #header>{{ news.title_2 }}</template>

              <template #lead>
                <b-link :href="news.link_2" target="_blank">바로가기</b-link>
              </template>

              <hr class="my-4" />

              <p>
                {{ news.description_2 }}
              </p>
              <p>
                {{ news.pubDate_2 }}
              </p>
            </b-jumbotron></b-col
          >
        </b-row>
      </div>
    </div>
    <b-card-footer class="py-4 d-flex justify-content-end"> </b-card-footer>
  </b-card>
</template>
<script>
import projects from "../projects";
import { Table, TableColumn } from "element-ui";
import { newsSearch } from "@/api/news";

export default {
  name: "light-table",
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  },
  data() {
    return {
      newsList: [],
      projects,
      currentPage: 1
    };
  },
  mounted() {
    this.newsList = [];
    newsSearch(
      response => {
        for (let i = 0; i < response.data.length; i++) {
          this.newsList.push({
            pubDate_1: response.data[i].pubDate,
            link_1: response.data[i].link,
            description_1: response.data[i].description,
            title_1: response.data[i].title,
            pubDate_2: response.data[i + 1].pubDate,
            link_2: response.data[i + 1].link,
            description_2: response.data[i + 1].description,
            title_2: response.data[i + 1].title
          });
          i++;
        }
      },
      error => {}
    );
  }
};
</script>
