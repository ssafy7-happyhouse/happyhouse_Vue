import { apiInstance } from "./index.js";

const api = apiInstance();

async function getList(success, fail) {
  await api
    .get(`/qna`)
    .then(success)
    .catch(fail);
}

async function getArticleCommentByBoardno(boardno, success, fail) {
  await api
    .get(`/qna/${boardno}/all`)
    .then(success)
    .catch(fail);
}

async function deleteArticle(boardno, success, fail) {
  await api
    .delete(`/qna/${boardno}`)
    .then(success)
    .catch(fail);
}

async function getArticleByBoardno(boardno, success, fail) {
  await api
    .get(`/qna/${boardno}`)
    .then(success)
    .catch(fail);
}

// function logout(success, fail)

export {
  getList,
  getArticleCommentByBoardno,
  deleteArticle,
  getArticleByBoardno
};
