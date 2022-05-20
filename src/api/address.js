import { apiInstance } from "./index.js";

const api = apiInstance();

function dongList(param, success, fail) {
  api
    .get(`/dong/${param}`)
    .then(success)
    .catch(fail);
}

export { dongList };
