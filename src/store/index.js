import Vue from 'vue'
import Vuex from 'vuex'

// 导入user模块
import user from './modules/user.js'
// 导入cart购物车模块
import cart from './modules/cart.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    token (state) {
      return state.user.userInfo.token
    }
  },
  modules: {
    user,
    cart
  }
})
