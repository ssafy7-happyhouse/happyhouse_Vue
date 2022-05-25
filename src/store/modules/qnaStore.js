const qnaStore = {
    namespaced: true,
    state: {
        pageNum: 1,
        pageSize: 10,
        pages: null,
        boardno: null,
    },
    mutations: {
        SET_BOARDNO(state, boardno){
            state.boardno = boardno;
        }
    }
}

export default qnaStore;