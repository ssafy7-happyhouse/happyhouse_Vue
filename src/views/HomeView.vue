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
              style="height: 1000px;"
            ></div>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { API_KEY } from "./Maps/API_KEY";

export default {
  methods: {
    initMap() {
      const container = document.querySelector("#map-custom");
      const options = {
        center: new kakao.maps.LatLng(35.19656853772262, 129.0807270648317),
        level: 3
      };
      const map = new kakao.maps.Map(container, options);
      // const markerPosition = new kakao.maps.LatLng(
      //   35.19656853772262,
      //   129.0807270648317
      // );

      // const marker = new kakao.maps.Marker({
      //   position: markerPosition
      // });
      // marker.setMap(map);
    }
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      script.onload = () => kakao.maps.load(this.initMap);

      script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${API_KEY}`;
      document.head.appendChild(script);
    }
  }
};
</script>
