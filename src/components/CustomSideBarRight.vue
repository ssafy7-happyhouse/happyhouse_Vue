<template>
  <div id="customSidebar" class="sidepanel">
    <a href="javascript:void(0)" class="closebtn" @click="closeSidebar"
      >&times;</a
    >
    <div>
      <b-jumbotron style="margin:30px; padding-bottom: 20px;">
        <template #header>{{ title }}</template>
        <template #lead>
          {{ aptAddress }}
        </template>
        <hr class="my-4" />
        <div>
          <b-table
            striped
            hover
            :items="aptList"
            @row-clicked="tableClick"
          ></b-table>
        </div>
        <div>
          <b-pagination
            v-model="curPageNum"
            :total-rows="pages"
            :per-page="pageSize"
            first-number
            align="center"
            @change="pageClick"
          ></b-pagination>
        </div>
      </b-jumbotron>
      <div class="chart" style="margin:30px;" v-if="this.aptAddress != ''">
        <line-chart
          :height="250"
          :chart-data="this.chartData"
          :key="this.aptAddress"
        >
        </line-chart>
        <!-- <bar-chart :height="250" :chart-data="this.chartData"> </bar-chart> -->
      </div>
    </div>
    <!-- <a href="#">About</a>
    <a href="#">Services</a>
    <a href="#">Clients</a>
    <a href="#">Contact</a> -->
  </div>
</template>
<script>
import NavbarToggleButton from "@/components/NavbarToggleButton";
import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "sidebar",
  components: {
    NavbarToggleButton,
    LineChart,
    BarChart
  },
  data() {
    return {
      curPageNum: 1,
      aptName: "",
      chart: {
        activeIndex: 0,
        chartData: {
          datasets: [
            {
              label: "평균거래가격",
              data: []
            }
          ],
          labels: []
        }
        // extraOptions: chartConfigs.blueChartOptions
      }
    };
  },
  computed: {
    ...mapGetters("mapStore", [
      "title",
      "aptList",
      "aptAddress",
      "currentDongCode",
      "pageNum",
      "pageSize",
      "pages",
      "chartData"
    ])
  },
  watch: {
    pageNum(value) {
      console.log(1);
      this.curPageNum = value;
    }
  },
  methods: {
    ...mapActions("mapStore", [
      "getAptListByDongCodeAndAptName",
      "getAptListByDongCode"
    ]),

    closeSidebar() {
      document.getElementById("customSidebar").style.width = "0";
    },
    tableClick(event) {
      let dongCode = this.currentDongCode;
      let pageNum = 1;
      let pageSize = 6;
      this.curPageNum = 1;
      if (Object.keys(event).includes("아파트명")) {
        let aptName = event.아파트명;
        this.getAptListByDongCodeAndAptName({
          dongCode,
          aptName,
          pageNum,
          pageSize
        });
        this.aptName = event.아파트명;
      }
    },
    pageClick(event) {
      let dongCode = this.currentDongCode;
      let pageNum = event;
      let pageSize = 6;
      let aptName = this.title;
      let address = this.aptAddress;
      if (address.length > 0) {
        this.getAptListByDongCodeAndAptName({
          dongCode,
          aptName,
          pageNum,
          pageSize
        });
      } else {
        this.getAptListByDongCode({ dongCode, pageNum, pageSize });
      }
    }
  }
};
</script>

<style scoped>
/* The sidepanel menu */
.sidepanel {
  height: 100%; /* Specify a height */
  width: 0; /* 0 width - change this with JavaScript */
  position: fixed; /* Stay in place */
  z-index: 1; /* Stay on top */
  top: 0;
  right: 0;
  background-color: rgb(255, 255, 255); /* Black*/
  overflow-x: hidden; /* Disable horizontal scroll */
  padding-top: 60px; /* Place content 60px from the top */
  transition: 0.5s; /* 0.5 second transition effect to slide in the sidepanel */
}

/* The sidepanel links */
.sidepanel a {
  padding: 8px 8px 8px 32px;
  text-decoration: none;
  font-size: 25px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

/* When you mouse over the navigation links, change their color */
.sidepanel a:hover {
  color: #f1f1f1;
}

/* Position and style the close button (top right corner) */
.sidepanel .closebtn {
  position: absolute;
  top: 0;
  left: 0;
  padding-left: 0;
  font-size: 36px;
  margin-left: 50px;
}

/* Style the button that is used to open the sidepanel */
.openbtn {
  font-size: 20px;
  cursor: pointer;
  background-color: #111;
  color: white;
  padding: 10px 15px;
  border: none;
}

.openbtn:hover {
  background-color: #444;
}
</style>
