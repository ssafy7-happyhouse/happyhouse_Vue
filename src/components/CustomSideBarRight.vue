<template>
  <div id="customSidebar" class="sidepanel">
    <a href="javascript:void(0)" class="closebtn" @click="closeSidebar"
      >&times;</a
    >
    <div>
      <b-jumbotron style="margin:30px; padding-bottom: 20px;">
        <template #header>{{ aptName }}</template>
        <template #lead>
          {{ aptAddress }}
        </template>
        <hr class="my-4" />
        <div>
          <b-table striped hover :items="aptList"></b-table>
        </div>
        <div>
          <b-pagination
            v-model="currentPage"
            :total-rows="rows"
            :per-page="perPage"
            first-number
          ></b-pagination>
        </div>
      </b-jumbotron>
      <div class="chart" style="margin:30px;">
        <line-chart :height="250" :chart-data="chart.chartData"> </line-chart>
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
import { mapGetters } from "vuex";

export default {
  name: "sidebar",
  components: {
    NavbarToggleButton,
    LineChart
  },
  data() {
    return {
      rows: 100,
      perPage: 1,
      currentPage: 2,
      chart: {
        activeIndex: 0,
        chartData: {
          datasets: [
            {
              label: "Performance",
              data: [0, 20, 10, 30, 15, 40, 20, 60, 60]
            }
          ],
          labels: ["May", "Jun", "Jul", "Aug", "Sep"]
        }
        // extraOptions: chartConfigs.blueChartOptions
      }
    };
  },
  computed: {
    ...mapGetters("mapStore", ["aptName", "aptList", "aptAddress"])
  },

  props: {
    logo: {
      type: String,
      default: "img/brand/green.png",
      description: "Sidebar app logo"
    },
    autoClose: {
      type: Boolean,
      default: true,
      description:
        "Whether sidebar should autoclose on mobile when clicking an item"
    }
  },
  provide() {
    return {
      autoClose: this.autoClose
    };
  },
  methods: {
    closeSidebar() {
      document.getElementById("customSidebar").style.width = "0";
    },
    showSidebar() {}
  },
  beforeDestroy() {
    if (this.$sidebar.showSidebar) {
      this.$sidebar.showSidebar = false;
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
