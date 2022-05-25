import { apiInstance } from "./index.js";

const api = apiInstance();

function newsSearch(success, fail) {
  api
    .get(`/naver/search`)
    .then(success)
    .catch(fail);
}
export { newsSearch };
