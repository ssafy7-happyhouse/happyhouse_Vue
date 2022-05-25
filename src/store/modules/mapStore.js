import { API_KEY } from "@/views/Maps/API_KEY";
import { aptList } from "@/api/apartment";
import {
  aptDetailListByaptCode,
  aptListByDongCode,
  aptDetailListByAptCodeAndAptName,
  aptDealByAptCode,
  aptListByDong,
  aptListByGugun
} from "../../api/apartment";
import imageSrc from "@/assets/marker.png";
import clustererSrc from "@/assets/clusterer.png";

const mapStore = {
  namespaced: true,
  state: {
    customOverlay: null,
    markerLatLng: [0, 0],
    title: null,
    aptAddress: null,
    clusterer: null,
    map: null,
    markers: [],
    overlays: [],
    aptList: [],
    currentDongCode: "",
    pageNum: 1,
    pageSize: 6,
    pages: 76,
    minArea: 0,
    maxArea: 100,
    minAmount: 10000,
    maxAmount: 300000,
    minBuildYear: 2000,
    maxBuildYear: 2022,
    filterValue: [
      [0, 100],
      [0, 30],
      [0, 21]
    ],
    level: 5,
    chartData: { labels: [], datasets: [{ data: [], label: "거래가격" }] }
  },

  getters: {
    customOverlay(state) {
      return state.customOverlay;
    },
    markerLatLng(state) {
      return state.markerLatLng;
    },
    level(state) {
      return state.level;
    },
    filterValue(state) {
      return state.filterValue;
    },
    map(state) {
      return state.map;
    },
    title(state) {
      return state.title;
    },
    markers(state) {
      return state.markers;
    },
    overlays(state) {
      return state.overlays;
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
    chartData(state) {
      return state.chartData;
    },
    currentDongCode(state) {
      return state.currentDongCode;
    }
  },

  mutations: {
    SET_CUSTOMOVERLAY: (state, customOverlay) => {
      state.customOverlay = customOverlay;
    },
    REMOVE_CUSTOMOVERLAY: state => {
      state.customOverlay.setMap(null);
      state.customOverlay = null;
    },
    SET_MARKERLATLNG: (state, markerLatLng) => {
      state.markerLatLng = markerLatLng;
    },
    SET_LEVEL: (state, level) => {
      state.level = level;
    },
    SET_FILTERVALUE: (state, filterValue) => {
      state.filterValue = filterValue;
    },
    SET_CURRENTDONGCODE: (state, currentDongCode) => {
      state.currentDongCode = currentDongCode;
    },
    SET_MAP: (state, map) => {
      state.map = map;
    },
    SET_CLUSTERER: (state, clusterer) => {
      state.clusterer = clusterer;
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
    SET_MARKERS: (state, marker) => {
      state.markers.push(marker);
    },
    SET_OVERLAYS: (state, overlay) => {
      state.overlays.push(overlay);
    },
    REMOVE_MARKERS: state => {
      state.markers.forEach(marker => {
        marker.setMap(null);
      });
      state.markers = [];
    },
    REMOVE_OVERLAYS: state => {
      state.overlays.forEach(overlay => {
        overlay.setMap(null);
      });
      state.overlays = [];
    },
    REMOVE_CLUSTERER: state => {
      state.clusterer.clear();
    },
    SET_APTDETAIL: (state, aptDetail) => {
      let aptList = [];
      aptDetail.forEach(element => {
        aptList.push({
          계약년월: element.dealYear + "/" + element.dealMonth,
          가격: Math.round(element.dealAmount / 100) / 100 + "억",
          면적: Math.round(element.area / 3.3058) + "평",
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
    SET_CHARTDATADATE: (state, dealDate) => {
      state.chartData.labels.push(dealDate);
    },
    SET_CHARTDATAAMOUNT: (state, dealAmount) => {
      state.chartData.datasets[0].data.push(dealAmount);
    },
    REMOVE_CHARTDATA: state => {
      state.chartData.labels.length = 0;
      state.chartData.datasets[0].data.length = 0;
    },
    SET_MAPLEVEL: state => {
      state.map.setLevel(5);
    }
  },

  actions: {
    setCustomOverlay({ commit, getters }, { customOverlay }) {
      commit("SET_CUSTOMOVERLAY", customOverlay);
    },
    category({ commit, getters }) {
      // 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
      let placeOverlay = new kakao.maps.CustomOverlay({ zIndex: 1 });
      let contentNode = document.createElement("div"); // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다
      let markers = []; // 마커를 담을 배열입니다
      let currCategory = ""; // 현재 선택된 카테고리를 가지고 있을 변수입니다

      let map = getters.map;

      let ps = new kakao.maps.services.Places(map);

      // 지도에 idle 이벤트를 등록합니다
      kakao.maps.event.addListener(map, "idle", searchPlaces);

      // 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다
      contentNode.className = "placeinfo_wrap";

      // 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
      // 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다
      addEventHandle(contentNode, "mousedown", kakao.maps.event.preventMap);
      addEventHandle(contentNode, "touchstart", kakao.maps.event.preventMap);

      // 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
      function addEventHandle(target, type, callback) {
        if (target.addEventListener) {
          target.addEventListener(type, callback);
        } else {
          target.attachEvent("on" + type, callback);
        }
      }
      // 카테고리 검색을 요청하는 함수입니다
      function searchPlaces() {
        if (!currCategory) {
          return;
        }

        // 커스텀 오버레이를 숨깁니다
        placeOverlay.setMap(null);

        // 지도에 표시되고 있는 마커를 제거합니다
        removeMarker();

        ps.categorySearch(currCategory, placesSearchCB, { useMapBounds: true });
      }
      // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
      function changeCategoryClass(el) {
        var category = document.getElementById("category"),
          children = category.children,
          i;

        for (i = 0; i < children.length; i++) {
          children[i].className = "";
        }

        if (el) {
          el.className = "on";
        }
      }

      // 카테고리를 클릭했을 때 호출되는 함수입니다
      function onClickCategory() {
        var id = this.id,
          className = this.className;

        placeOverlay.setMap(null);

        if (className === "on") {
          currCategory = "";
          changeCategoryClass();
          removeMarker();
        } else {
          currCategory = id;
          changeCategoryClass(this);
          searchPlaces();
        }
      }
      // 커스텀 오버레이 컨텐츠를 설정합니다
      placeOverlay.setContent(contentNode);

      // 각 카테고리에 클릭 이벤트를 등록합니다
      function addCategoryClickEvent() {
        var category = document.getElementById("category");
        let children = category.children;

        for (var i = 0; i < children.length; i++) {
          children[i].onclick = onClickCategory;
        }
      }
      // 각 카테고리에 클릭 이벤트를 등록합니다
      addCategoryClickEvent();

      // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
      function placesSearchCB(data, status, pagination) {
        if (status === kakao.maps.services.Status.OK) {
          // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
          displayPlaces(data);
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
          // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
        } else if (status === kakao.maps.services.Status.ERROR) {
          // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요
        }
      }

      // 지도에 마커를 표출하는 함수입니다
      function displayPlaces(places) {
        // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
        // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
        var order = document
          .getElementById(currCategory)
          .getAttribute("data-order");

        for (var i = 0; i < places.length; i++) {
          // 마커를 생성하고 지도에 표시합니다
          var marker = addMarker(
            new kakao.maps.LatLng(places[i].y, places[i].x),
            order
          );

          // 마커와 검색결과 항목을 클릭 했을 때
          // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
          (function(marker, place) {
            kakao.maps.event.addListener(marker, "click", function() {
              displayPlaceInfo(place);
            });
          })(marker, places[i]);
        }
      }

      // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
      function addMarker(position, order) {
        var imageSrc =
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png", // 마커 이미지 url, 스프라이트 이미지를 씁니다
          imageSize = new kakao.maps.Size(27, 28), // 마커 이미지의 크기
          imgOptions = {
            spriteSize: new kakao.maps.Size(72, 208), // 스프라이트 이미지의 크기
            spriteOrigin: new kakao.maps.Point(46, order * 36), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new kakao.maps.Point(11, 28) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
          },
          markerImage = new kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imgOptions
          ),
          marker = new kakao.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage
          });

        marker.setMap(map); // 지도 위에 마커를 표출합니다
        markers.push(marker); // 배열에 생성된 마커를 추가합니다

        return marker;
      }

      // 지도 위에 표시되고 있는 마커를 모두 제거합니다
      function removeMarker() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }

      // 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
      function displayPlaceInfo(place) {
        var content =
          '<div class="placeinfo">' +
          '   <a class="title" href="' +
          place.place_url +
          '" target="_blank" title="' +
          place.place_name +
          '">' +
          place.place_name +
          "</a>";

        if (place.road_address_name) {
          content +=
            '    <span title="' +
            place.road_address_name +
            '">' +
            place.road_address_name +
            "</span>" +
            '  <span class="jibun" title="' +
            place.address_name +
            '">(지번 : ' +
            place.address_name +
            ")</span>";
        } else {
          content +=
            '    <span title="' +
            place.address_name +
            '">' +
            place.address_name +
            "</span>";
        }

        content +=
          '    <span class="tel">' +
          place.phone +
          "</span>" +
          "</div>" +
          '<div class="after"></div>';

        contentNode.innerHTML = content;
        placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
        placeOverlay.setMap(map);
      }
    },
    initMap(
      { commit, dispatch },
      { minAmount, maxAmount, minArea, maxArea, minBuildYear, maxBuildYear }
    ) {
      const container = document.querySelector("#map-custom");
      const options = {
        center: new kakao.maps.LatLng(37.541, 126.986),
        level: 5
      };
      let map = new kakao.maps.Map(container, options);
      // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
      kakao.maps.event.addListener(map, "zoom_changed", function() {
        // 지도의 현재 레벨을 얻어옵니다
        var level = map.getLevel();
        dispatch("changeZoom", { level, map });
      });
      dispatch("makeMarker", {
        map,
        minAmount,
        maxAmount,
        minArea,
        maxArea,
        minBuildYear,
        maxBuildYear
      });
      commit("SET_MAP", map);
    },
    changeZoom({ commit, dispatch, getters }, { level, map, check }) {
      let value = getters.filterValue;
      if (getters.customOverlay != null) {
        commit("REMOVE_CUSTOMOVERLAY");
      }

      if (level == 3) {
        commit("REMOVE_OVERLAYS");
        commit("REMOVE_MARKERS");

        aptList(
          {
            minArea: Math.round(value[0][0] * 3.305),
            maxArea: Math.round(value[0][1] * 3.305),
            minAmount: value[1][0] * 10000,
            maxAmount: value[1][1] * 10000,
            minBuildYear: value[2][0] + 2000,
            maxBuildYear: value[2][1] + 2000
          },
          response => {
            let positions = [];
            response.data.forEach(element => {
              positions.push({
                aptCode: element.aptCode,
                title: element.aptName,
                latlng: new kakao.maps.LatLng(element.lat, element.lng),
                amount: element.lastAmount,
                area: element.area
              });
            });
            dispatch("makeMarkerFunction", { positions, map });
          }
        );
      } else if (level == 4 || level == 6 || check) {
        commit("REMOVE_OVERLAYS");
        commit("REMOVE_MARKERS");
        aptListByDong(
          {
            minArea: Math.round(value[0][0] * 3.305),
            maxArea: Math.round(value[0][1] * 3.305),
            minAmount: value[1][0] * 10000,
            maxAmount: value[1][1] * 10000,
            minBuildYear: value[2][0] + 2000,
            maxBuildYear: value[2][1] + 2000
          },
          response => {
            let positions = [];
            response.data.forEach(element => {
              positions.push({
                latlng: new kakao.maps.LatLng(element.lat, element.lng),
                amount: element.avgAmount,
                area: element.dongName
              });
            });
            dispatch("makeMarkerFunction", { positions, map });
          }
        );
      } else if (level == 7) {
        commit("REMOVE_OVERLAYS");
        commit("REMOVE_MARKERS");

        aptListByGugun(
          {
            minArea: Math.round(value[0][0] * 3.305),
            maxArea: Math.round(value[0][1] * 3.305),
            minAmount: value[1][0] * 10000,
            maxAmount: value[1][1] * 10000,
            minBuildYear: value[2][0] + 2000,
            maxBuildYear: value[2][1] + 2000
          },
          response => {
            let positions = [];
            response.data.forEach(element => {
              positions.push({
                latlng: new kakao.maps.LatLng(element.lat, element.lng),
                amount: element.avgAmount,
                area: element.gugunName
              });
            });
            dispatch("makeMarkerFunction", { positions, map });
          },
          error => {}
        );
      }
      commit("SET_LEVEL", level);
    },
    setFilterValue({ commit }, val) {
      commit("SET_FILTERVALUE", val);
    },
    makeMarker(
      { dispatch },
      {
        // clusterer,
        map,
        minAmount,
        maxAmount,
        minArea,
        maxArea,
        minBuildYear,
        maxBuildYear
      }
    ) {
      aptListByDong(
        {
          minArea: minArea,
          maxArea: maxArea,
          minAmount: minAmount,
          maxAmount: maxAmount,
          minBuildYear: minBuildYear,
          maxBuildYear: maxBuildYear
        },
        response => {
          let positions = [];
          response.data.forEach(element => {
            positions.push({
              latlng: new kakao.maps.LatLng(element.lat, element.lng),
              amount: element.avgAmount,
              area: element.dongName
            });
          });
          dispatch("makeMarkerFunction", { positions, map });
        }
      );
    },

    makeMarkerFunction({ commit, dispatch, getters }, { positions, map }) {
      let level = getters.level;

      for (let i = 0; i < positions.length; i++) {
        // 마커 이미지의 이미지 크기 입니다
        let imageSize = new kakao.maps.Size(75, 55);

        // 마커 이미지를 생성합니다
        let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        let clusterImage = new kakao.maps.MarkerImage(clustererSrc, imageSize);
        // 마커를 생성합니다
        let marker;
        if (level <= 3) {
          marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: markerImage // 마커 이미지
          });
        } else {
          marker = new kakao.maps.Marker({
            map: map, // 마커를 표시할 지도
            position: positions[i].latlng, // 마커를 표시할 위치
            title: positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
            image: clusterImage // 마커 이미지
          });
        }
        commit("SET_MARKERS", marker);

        let aptCode = positions[i].aptCode;
        let latlng = positions[i].latlng;

        let markerClick = function() {
          let pageNum = 1;
          let pageSize = 6;
          dispatch("getAptDealByAptCode", { aptCode, pageNum, pageSize });
          // commit("SET_MAPLEVEL");
          map.setLevel(2);
          map.panTo(latlng);
        };

        let markerClickDong = function() {
          map.panTo(latlng);
          map.setLevel(3);
        };

        let markerClickGugun = function() {
          map.panTo(latlng);
          map.setLevel(4);
        };

        let content = document.createElement("div");
        let areaContent = document.createElement("p");
        let amountContent = document.createElement("p");

        if (!isNaN(positions[i].area)) {
          let areaText = document.createTextNode(
            Math.round(positions[i].area / 3.3058) + "평"
          );
          areaContent.appendChild(areaText);
        } else {
          let areaText = document.createTextNode(positions[i].area);
          areaContent.appendChild(areaText);
        }
        let amountText = document.createTextNode(
          Math.round(Math.round(positions[i].amount / 100) / 100) + "억"
        );
        amountContent.appendChild(amountText);

        content.appendChild(areaContent);
        content.appendChild(amountContent);
        content.className = "custom-marker";
        if (level <= 3) {
          content.addEventListener("click", markerClick);
          kakao.maps.event.addListener(marker, "click", markerClick);
        } else if (level <= 6) {
          content.addEventListener("click", markerClickDong);
          kakao.maps.event.addListener(marker, "click", markerClickDong);
        } else {
          content.addEventListener("click", markerClickGugun);
          kakao.maps.event.addListener(marker, "click", markerClickGugun);
        }

        var overlay = new kakao.maps.CustomOverlay({
          content: content,
          map: map,
          position: latlng,
          value: Math.round(positions[i].avgAmount / 100) / 100
        });

        overlay.setMap(map);

        commit("SET_OVERLAYS", overlay);

        kakao.maps.event.addListener(marker, "mouseover", function() {
          // console.log("marker mouseover!");
        });

        kakao.maps.event.addListener(marker, "mouseout", function() {
          // console.log("marker mouseout!");
        });
      }
    },

    async getAptDealByAptCode(
      { commit, dispatch },
      { aptCode, pageNum, pageSize }
    ) {
      commit("REMOVE_CHARTDATA");

      await aptDealByAptCode(
        { aptCode },
        response => {
          response.data.forEach(element => {
            let date = element.dealYear + "/" + element.dealMonth;
            let dealAmount = element.dealAmount;
            commit("SET_CHARTDATADATE", date);
            commit(
              "SET_CHARTDATAAMOUNT",
              Math.round(Number(dealAmount) / 100) / 100
            );
          });
        },
        error => {}
      );
      dispatch("getAptDetail", { aptCode, pageNum, pageSize });
    },
    getMap({ dispatch }) {
      let minAmount = 0;
      let maxAmount = 300000;
      let minArea = 0;
      let maxArea = 300;
      let minBuildYear = 2000;
      let maxBuildYear = 2022;
      if (window.kakao && window.kakao.maps) {
        dispatch("initMap", {
          minAmount,
          maxAmount,
          minArea,
          maxArea,
          minBuildYear,
          maxBuildYear
        });
        dispatch("category");
      } else {
        const script = document.createElement("script");
        script.src = `http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=${API_KEY}&libraries=services,clusterer`;

        script.onload = () => {
          kakao.maps.load(() => {
            dispatch("initMap", {
              minAmount,
              maxAmount,
              minArea,
              maxArea,
              minBuildYear,
              maxBuildYear
            });
            dispatch("category");
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
          commit("SET_PAGENUM", response.data.pageNum);
          commit("SET_PAGESIZE", response.data.pageSize);
          commit("SET_PAGES", response.data.total);
          commit("SET_TITLE", response.data.list[0].aptName);
          commit("SET_CURRENTDONGCODE", response.data.list[0].dongCode);
          commit(
            "SET_APTADDRESS",
            response.data.list[0].sidoName +
              " " +
              response.data.list[0].gugunName +
              " " +
              response.data.list[0].dongName +
              " " +
              response.data.list[0].jibun
          );
          commit("SET_APTDETAIL", response.data.list);
          document.getElementById("customSidebar").style.width = "500px";
          commit("SET_MARKERLATLNG", [
            response.data.list[0].lat,
            response.data.list[0].lng
          ]);
        },
        error => {}
      );
    },
    getAptListByDongCode({ commit }, { dongCode, pageNum, pageSize }) {
      aptListByDongCode(
        dongCode,
        {
          pageNum: pageNum,
          pageSize: pageSize
        },
        response => {
          commit(
            "SET_TITLE",
            response.data.list[0].sidoName +
              " " +
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
    getAptListByDongCodeAndAptName(
      { commit, getters },
      { dongCode, aptName, pageNum, pageSize }
    ) {
      let map = getters.map;
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
            response.data.list[0].sidoName +
              " " +
              response.data.list[0].gugunName +
              " " +
              response.data.list[0].dongName +
              " " +
              response.data.list[0].jibun
          );
          commit("SET_APTDETAIL", response.data.list);
          map.panTo(
            new kakao.maps.LatLng(
              response.data.list[0].lat,
              response.data.list[0].lng
            )
          );
          commit("SET_MARKERLATLNG", [
            response.data.list[0].lat,
            response.data.list[0].lng
          ]);
        },
        error => {}
      );
    }
  }
};

export default mapStore;
