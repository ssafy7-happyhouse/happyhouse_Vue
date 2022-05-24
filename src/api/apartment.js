import { apiInstance } from "./index.js";

const api = apiInstance();

function aptList(params, success, fail) {
  api
    .get(
      `/apartment?minAmount=${params.minAmount}&maxAmount=${params.maxAmount}&minArea=${params.minArea}&maxArea=${params.maxArea}&minBuildYear=${params.minBuildYear}&maxBuildYear=${params.maxBuildYear}`
    )
    .then(success)
    .catch(fail);
}

function aptListByName(params, success, fail) {
  api
    .get(`/apartment/${params}`)
    .then(success)
    .catch(fail);
}

function aptDetailListByaptCode(params, page, success, fail) {
  api
    .get(
      `/apartment/deal/${params}?pageNum=${page.pageNum}&pageSize=${page.pageSize}`
    )
    .then(success)
    .catch(fail);
}

function aptListByDongCode(params, page, success, fail) {
  api
    .get(
      `/apartment/dong/${params}?pageNum=${page.pageNum}&pageSize=${page.pageSize}`
    )
    .then(success)
    .catch(fail);
}

function aptDetailListByAptCodeAndAptName(params, page, success, fail) {
  api
    .get(
      `/apartment/dong/${params.dongCode}/name/${params.aptName}?pageNum=${page.pageNum}&pageSize=${page.pageSize}`
    )
    .then(success)
    .catch(fail);
}

function aptDealByAptCode(params, success, fail) {
  api
    .get(`/apartment/deal/chart/${params.aptCode}`)
    .then(success)
    .catch(fail);
}
export {
  aptList,
  aptListByName,
  aptDetailListByaptCode,
  aptListByDongCode,
  aptDetailListByAptCodeAndAptName,
  aptDealByAptCode
};
