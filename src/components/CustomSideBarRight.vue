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
        <div>
          <bar-chart
            :height="250"
            :chart-data="this.chartData"
            :key="this.aptAddress"
          >
          </bar-chart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import NavbarToggleButton from "@/components/NavbarToggleButton";
import LineChart from "@/components/Charts/LineChart";
import BarChart from "@/components/Charts/BarChart";
import { mapGetters, mapActions, mapMutations } from "vuex";

export default {
  name: "sidebar",
  components: {
    NavbarToggleButton,
    LineChart,
    BarChart
  },
  data() {
    return {
      options: [
        { value: "A", text: "막대그래프" },
        { value: "B", text: "곡선그래프" }
      ],
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
    ...mapMutations("mapStore", ["REMOVE_CUSTOMOVERLAY"]),
    ...mapGetters("mapStore", [
      "title",
      "aptList",
      "aptAddress",
      "currentDongCode",
      "pageNum",
      "pageSize",
      "pages",
      "chartData",
      "markerLatLng",
      "map",
      "customOverlay"
    ])
  },
  watch: {
    markerLatLng(value) {
      this.checkMarker();
    },
    pageNum(value) {
      this.curPageNum = value;
    }
  },
  methods: {
    ...mapActions("mapStore", [
      "getAptListByDongCodeAndAptName",
      "getAptListByDongCode",
      "setCustomOverlay"
    ]),
    checkMarker() {
      if (this.customOverlay != null) {
        this.REMOVE_CUSTOMOVERLAY;
      }
      // 커스텀 오버레이에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
      var content =
        '<div class="customoverlay">' +
        '    <span class="title">' +
        this.title +
        "</span>" +
        "  </a>" +
        "</div>";
      // 커스텀 오버레이가 표시될 위치입니다
      var position = new kakao.maps.LatLng(
        this.markerLatLng[0],
        this.markerLatLng[1]
      );

      // 커스텀 오버레이를 생성합니다
      var customOverlay = new kakao.maps.CustomOverlay({
        map: this.map,
        position: position,
        content: content,
        yAnchor: 1
      });
      this.setCustomOverlay({ customOverlay });
    },

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
