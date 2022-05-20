import { API_KEY } from "@/views/Maps/API_KEY";
import { aptList } from "@/api/apartment";

const mapStore = {
  namespaced: true,
  state() {
    map: null;
  },

  getters: {},

  mutations: {
    SET_MAP: (state, map) => {
      state.map = map;
    }
  },

  actions: {
    initMap: ({ commit }) => {
      const container = document.querySelector("#map-custom");
      const options = {
        center: new kakao.maps.LatLng(35.19656853772262, 129.0807270648317),
        level: 3
      };
      let map = new kakao.maps.Map(container, options);
      aptList(response => {
        let positions = [];
        response.data.forEach(element => {
          positions.push({
            title: element.aptName,
            latlng: new kakao.maps.LatLng(element.lat, element.lng)
          });
        });

        var imageSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        for (var i = 0; i < positions.length; i++) {
          // 마커 이미지의 이미지 크기 입니다
          var imageSize = new kakao.maps.Size(24, 35);

          // 마커 이미지를 생성합니다
          var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
          // 마커를 생성합니다
          var marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage // 마커 이미지
          });
        }

        map.setCenter(positions[0].latlng);
      });

      commit("SET_MAP", map);
    },
    getMap: ({ commit, dispatch }) => {
      if (window.kakao && window.kakao.maps) {
        dispatch("initMap");
      } else {
        const script = document.createElement("script");
        script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${API_KEY}&libraries=services`;

        script.onload = () => {
          kakao.maps.load(() => {
            dispatch("initMap");
          });
        };
        document.head.appendChild(script);
      }
    }
  }
};

export default mapStore;
