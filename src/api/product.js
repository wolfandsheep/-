import request from './request'

// 1.根据搜索的关键词，或者分类id，获取搜索商品数据
export function getProListApi (obj) {
  const { categoryId, goodsName, page } = obj
  return request.get('/goods/list', {
    params: {
      categoryId,
      goodsName,
      page
    }
  })
}

// 2.根据id，获取商品详情数据
export const getProDetailApi = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}
