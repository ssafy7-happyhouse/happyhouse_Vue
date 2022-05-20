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
export { aptList, aptListByName };
