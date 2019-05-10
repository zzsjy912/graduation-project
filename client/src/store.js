import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    Userinfo: {},
    Movieinfo:{},
    MessageInfo:{},
  },
  mutations: {
    setUserinfo(state, data) {
      state.Userinfo = data;
    },
    setMovieinfo(state, data) {
      state.Movieinfo = data;
    },
    setMessageInfo(state, data) {
      state.MessageInfo = data;
    },
  },
  actions: {
    commitLoginState: ({ commit }, Userinfo) => commit('setUserinfo', Userinfo),
    commitMovieinfo: ({ commit }, Movieinfo) => commit('setMovieinfo', Movieinfo),
    commitMessageInfo: ({ commit }, MessageInfo) => commit('setMessageInfo', MessageInfo),
  }
})
