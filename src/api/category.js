import request from './request.js'

// 1.获取分类数据
export function getCategoryDataApi () {
  return request.get('/category/list')
}
