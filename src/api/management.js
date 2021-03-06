import { apiInstance } from "./index.js";

const api = apiInstance();

async function getUserList(success, fail) {
  await api
    .get(`/user/management/user`)
    .then(success)
    .catch(fail);
}

async function getUserListByPaging(pageInfo, success, fail) {
  await api
    .get(`/management/user/${pageInfo.pageNum}/${pageInfo.pageSize}`)
    .then(success)
    .catch(fail);
}

async function getCountArticleById(userid, success, fail) {
  await api
    .get(`/management/user/${userid}`)
    .then(success)
    .catch(fail);
}

async function deleteAllBoardById(userid, success, fail) {
  await api
    .delete(`/management/user/${userid}`)
    .then(success)
    .catch(fail);
}

// function logout(success, fail)

export { getUserListByPaging, getCountArticleById, deleteAllBoardById };
