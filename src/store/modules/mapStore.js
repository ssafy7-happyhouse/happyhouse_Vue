import { API_KEY } from "@/views/Maps/API_KEY";
import { aptList } from "@/api/apartment";
import { aptDetailListByaptCode } from "../../api/apartment";

const mapStore = {
  namespaced: true,
  state: {
    aptName: null,
    aptAddress: null,
    map: null,
    aptDetail: [],
    aptList: []
  },

  getters: {
    aptName(state) {
      return state.aptName;
    },
    aptAddress(state) {
      return state.aptAddress;
    },
    aptDetail(state) {
      return state.aptDetail;
    },
    aptList(state) {
      return state.aptList;
    }
  },

  mutations: {
    SET_MAP: (state, map) => {
      state.map = map;
    },
    SET_APTDETAIL: (state, aptDetail) => {
      state.aptDetail = aptDetail;
    },
    SET_APTNAME: (state, aptName) => {
      state.aptName = aptName;
    },
    SET_APTADDRESS: (state, aptAddress) => {
      state.aptAddress = aptAddress;
    },
    SET_APTLIST: (state, aptDetail) => {
      let aptList = [];
      aptDetail.forEach(element => {
        aptList.push({
          계약년월: element.dealYear + "/" + element.dealMonth,
          가격: element.dealAmount,
          면적: element.area,
          층:
            (element.floor < 0
              ? "지하 " + Math.abs(element.floor)
              : element.floor) + " 층"
        });
      });
      state.aptList = aptList;
    }
  },

  actions: {
    initMap: ({ commit, dispatch }) => {
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
            aptCode: element.aptCode,
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
          let aptCode = positions[i].aptCode;
          let latlng = positions[i].latlng;

          kakao.maps.event.addListener(marker, "click", function() {
            dispatch("getAptDetail", aptCode);
            document.getElementById("customSidebar").style.width = "500px";
            map.panTo(latlng);
          });

          kakao.maps.event.addListener(marker, "mouseover", function() {
            // console.log("marker mouseover!");
          });

          kakao.maps.event.addListener(marker, "mouseout", function() {
            // console.log("marker mouseout!");
          });
        }

        map.setCenter(positions[0].latlng);
      });

      commit("SET_MAP", map);
    },
    getMap: ({ dispatch }) => {
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
    },
    getAptDetail: ({ commit }, aptCode) => {
      let code = aptCode;
      aptDetailListByaptCode(
        code,
        response => {
          commit("SET_APTNAME", response.data[0].aptName);
          commit(
            "SET_APTADDRESS",
            response.data[0].gugunName +
              " " +
              response.data[0].dongName +
              " " +
              response.data[0].jibun
          );
          commit("SET_APTDETAIL", response.data);
          commit("SET_APTLIST", response.data);
        },
        error => {}
      );
    }
  }
};

export default mapStore;
