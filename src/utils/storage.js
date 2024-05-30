/**
 * vuex持久化存储
 */

// 键
const INFO_KEY = 'my_shopping_info'
const HISTORY_KEY = 'my_history'

// 1. 用户登录信息
export function getUserInfo () {
  const defaultObj = { token: '', userId: '' }
  const result = JSON.parse(localStorage.getItem(INFO_KEY))
  return result || defaultObj
}

export function setUserInfo (userInfo) {
  localStorage.setItem(INFO_KEY, JSON.stringify(userInfo))
}

// 2. 搜索历史记录
export function getHistory () {
  const defaultObj = []
  const result = JSON.parse(localStorage.getItem(HISTORY_KEY))
  return result || defaultObj
}

export function setHistory (history) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
}
