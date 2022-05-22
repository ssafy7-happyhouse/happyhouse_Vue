import { apiInstance } from "./index.js";

const api = apiInstance();

function aptList(success, fail) {
  api
    .get(`/apartment`)
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

export {
  aptList,
  aptListByName,
  aptDetailListByaptCode,
  aptListByDongCode,
  aptDetailListByAptCodeAndAptName
};
