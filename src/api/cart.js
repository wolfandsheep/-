import request from './request'

//  1.加入购物车
export function addCartApi (goodsId, goodsNum, goodsSkuId) {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

//  2.获取购物车列表
export function getCartListApi () {
  return request.get('cart/list')
}

// 3.更新购物车商品数量
export const changeCountApi = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/update', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 4.删除选中的购物车商品
export const delSelectApi = (cartIds) => {
  return request.post('/cart/clear', {
    cartIds
  })
}
