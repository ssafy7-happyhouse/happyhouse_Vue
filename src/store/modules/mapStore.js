import { API_KEY } from "@/views/Maps/API_KEY";
import { aptList } from "@/api/apartment";
import {
  aptDetailListByaptCode,
  aptListByDongCode,
  aptDetailListByAptCodeAndAptName
} from "../../api/apartment";

const mapStore = {
  namespaced: true,
  state: {
    title: null,
    aptAddress: null,
    map: null,
    aptList: [],
    currentDongCode: "",
    pageNum: 1,
    pageSize: 6,
    pages: 76
  },

  getters: {
    title(state) {
      return state.title;
    },
    pageNum(state) {
      return state.pageNum;
    },
    pageSize(state) {
      return state.pageSize;
    },
    pages(state) {
      return state.pages;
    },
    aptAddress(state) {
      return state.aptAddress;
    },
    aptList(state) {
      return state.aptList;
    },
    currentDongCode(state) {
      return state.currentDongCode;
    }
  },

  mutations: {
    SET_CURRENTDONGCODE: (state, currentDongCode) => {
      state.currentDongCode = currentDongCode;
    },
    SET_MAP: (state, map) => {
      state.map = map;
    },
    SET_PAGENUM: (state, pageNum) => {
      state.pageNum = pageNum;
    },
    SET_PAGESIZE: (state, pagesize) => {
      state.pagesize = pagesize;
    },
    SET_PAGES: (state, pages) => {
      state.pages = pages;
    },
    SET_TITLE: (state, title) => {
      state.title = title;
    },
    SET_APTADDRESS: (state, aptAddress) => {
      state.aptAddress = aptAddress;
    },
    SET_APTDETAIL: (state, aptDetail) => {
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
    },
    SET_APTLIST: (state, aptListByDong) => {
      let aptList = [];
      aptListByDong.forEach(element => {
        aptList.push({
          아파트명: element.aptName,
          건축년도: element.buildYear,
          지번: element.jibun
        });
      });
      state.aptList = aptList;
    },
    SET_MAPLEVEL: state => {
      state.map.setLevel(2);
    }
  },

  actions: {
    initMap: ({ commit, dispatch }) => {
      const container = document.querySelector("#map-custom");
      const options = {
        center: new kakao.maps.LatLng(35.19656853772262, 129.0807270648317),
        level: 4
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
            let pageNum = 1;
            let pageSize = 6;
            dispatch("getAptDetail", { aptCode, pageNum, pageSize });
            commit("SET_MAPLEVEL");
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
    getAptDetail: ({ commit }, { aptCode, pageNum, pageSize }) => {
      aptDetailListByaptCode(
        aptCode,
        {
          pageNum: pageNum,
          pageSize: pageSize
        },
        response => {
          console.log(response.data);
          commit("SET_PAGENUM", response.data.pageNum);
          commit("SET_PAGESIZE", response.data.pageSize);
          commit("SET_PAGES", response.data.total);
          commit("SET_TITLE", response.data.list[0].aptName);
          commit("SET_CURRENTDONGCODE", response.data.list[0].dongCode);
          commit(
            "SET_APTADDRESS",
            response.data.list[0].gugunName +
              " " +
              response.data.list[0].dongName +
              " " +
              response.data.list[0].jibun
          );
          commit("SET_APTDETAIL", response.data.list);
          document.getElementById("customSidebar").style.width = "500px";
        },
        error => {}
      );
    },
    getAptListByDongCode: ({ commit }, { dongCode, pageNum, pageSize }) => {
      aptListByDongCode(
        dongCode,
        {
          pageNum: pageNum,
          pageSize: pageSize
        },
        response => {
          commit(
            "SET_TITLE",
            response.data.list[0].gugunName +
              " " +
              response.data.list[0].dongName
          );
          commit("SET_PAGENUM", response.data.pageNum);
          commit("SET_PAGESIZE", response.data.pageSize);
          commit("SET_PAGES", response.data.total);
          commit("SET_APTADDRESS", "");
          commit("SET_CURRENTDONGCODE", dongCode);
          commit("SET_APTLIST", response.data.list);
          document.getElementById("myDropdown").classList.remove("show");
          document.getElementById("customSidebar").style.width = "500px";
        },
        error => {}
      );
    },
    getAptListByDongCodeAndAptName: (
      { commit },
      { dongCode, aptName, pageNum, pageSize }
    ) => {
      aptDetailListByAptCodeAndAptName(
        {
          dongCode: dongCode,
          aptName: aptName
        },
        {
          pageNum: pageNum,
          pageSize: pageSize
        },
        response => {
          commit("SET_PAGENUM", response.data.pageNum);
          commit("SET_PAGESIZE", response.data.pageSize);
          commit("SET_PAGES", response.data.total);
          commit("SET_TITLE", response.data.list[0].aptName);
          commit(
            "SET_APTADDRESS",
            response.data.list[0].gugunName +
              " " +
              response.data.list[0].dongName +
              " " +
              response.data.list[0].jibun
          );
          commit("SET_APTDETAIL", response.data.list);
        },
        error => {}
      );
    }
  }
};

export default mapStore;
