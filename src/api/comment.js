
import request from './request.js'

// 1.获取商品评价
export function getCommentApi (goodsId, limit) {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit
    }
  })
}
