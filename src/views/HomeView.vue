<template>
  <div>
    <base-header class="pb-6 pb-8 pt-5 pt-md-8 bg-gradient-success">
    </base-header>

    <b-container fluid class="mt--7">
      <b-row>
        <b-col>
          <b-card no-body class="border-0">
            <div
              id="map-custom"
              class="map-canvas"
              style="height: 1000px; z-index: 0;"
            ></div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: { ...mapState("mapStore", ["map"]) },
  methods: {
    ...mapActions("mapStore", ["initMap", "getMap", "getApt"])
  },
  mounted() {
    this.getMap();
  }
};
</script>
