import request from './request'

// 1.获取首页数据
export function getHomeDataApi (pageId = 0) {
  return request.get('/page/detail', {
    params: {
      pageId
    }
  })
}
