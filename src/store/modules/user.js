import { setUserInfo, getUserInfo } from '@/utils/storage.js'

export default {
  namespaced: true,
  state () {
    return {
      userInfo: getUserInfo()
    }
  },
  mutations: {
    setUserInfo (state, userInfo) {
      state.userInfo = userInfo
      // 持久化存储
      setUserInfo(userInfo)
    }
  },
  actions: {

  },
  getters: {

  }
}
