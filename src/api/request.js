import axios from 'axios'
// 导入vant的提示功能
import { Toast } from 'vant'
// 导入vuex
import store from '@/store/index.js'

const instace = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 2000,
  headers: {
    platform: 'h5'
  }
})

// (1) 请求拦截器
instace.interceptors.request.use(
  (config) => {
    // (1) 开启loading效果
    Toast.loading({
      message: '加载中...',
      forbidClick: true, // 禁止背景点击
      duration: 0 // 设置为0，表示不会自动消失
    })
    // (2) 如果有token，则请求之前携带token
    if (store.getters.token) {
      config.headers['Access-Token'] = `${store.getters.token}`
      config.headers.platform = 'H5'
    }
    return config
  },
  (err) => {
    return Promise.reject(err)
  })
// (2) 响应拦截器
instace.interceptors.response.use(
  (resp) => {
    // (1) 处理response数据
    resp = resp.data

    // (2) 统一处理请求失败的情况
    if (resp.status !== 200) {
      Toast(resp.message)
      return Promise.reject(resp.message)
    }
    Toast.clear()

    // 最终，把data进行返回
    return resp.data
  },
  (err) => {
    Toast('响应失败了哦 !')
    return Promise.reject(err)
  }
)

export default instace
