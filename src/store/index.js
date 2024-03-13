import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: JSON.parse(window.sessionStorage.getItem('user')),
        routes: [],
        updateStudent: [],
        updateTeacher: [],
        updateScore:[],
        currentBoardId: -1,
        boardId: -1,
        currentCourseId: -1,
        currentCourseName: '',
    },
    mutations: {
        INIT_USER(state, user) {
            //keep data for refreshing page
            sessionStorage.setItem('user', user);
            localStorage.setItem('user', user);
        },
        REMOVE_USER(state) {
            sessionStorage.removeItem('user');
            localStorage.removeItem('user');
            state.user = '';
        },
        INIT_ROUTES(state, data) {
            state.routes = data;
        },
        REMOVE_ROUTES(state) {
            state.routes = [];
        },
        INIT_UPDATE_STUDENT(state, data) {
            state.updateStudent = data;
        },
        INIT_UPDATE_TEACHER(state, data) {
            state.updateTeacher = data;
        },
        INIT_UPDATE_SCORE(state, data) {
            state.updateScore = data;
        },
        REMOVE_STUDENT(state) {
            state.updateStudent = '';
        },
        REMOVE_TEACHER(state) {
            state.updateTeacher = '';
        },
        REMOVE_SCORE(state) {
            state.updateScore = '';
        },
        ADD_CURRENT_BOARD_ID(state, data) {
            state.currentBoardId = data;
        },
        REMOVE_CURRENT_BOARD_ID(state) {
            state.currentBoardId = -1;
        },
    },
    actions: {},
    modules: {}
})
