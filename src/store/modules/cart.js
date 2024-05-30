/**
 * 购物车
 */

import { getCartListApi, changeCountApi, delSelectApi } from '@/api/cart.js'
import { Toast } from 'vant'
export default {
  namespaced: true,
  state () {
    return {
      cartList: [] // 购物车列表
    }
  },
  mutations: {
    // 1.设置商品列表数据
    setCartList (state, resp) {
      state.cartList = resp.list
    },
    // 2.切换商品选中状态
    toggleCheck (state, goodsId) {
      const find = state.cartList.find(item => item.goods_id === goodsId)
      find.isChecked = !find.isChecked
    },
    // 3.全选按钮的选中状态
    allCheck (state, checked) {
      // 让所有的小选框同步全选按钮的状态
      state.cartList.forEach(item => {
        item.isChecked = !checked
      })
    },
    // 4. 修改本地商品数量
    changeCount (state, obj) {
      const { goodsId, goodsNum } = obj
      const findObj = state.cartList.find(item => item.goods_id === goodsId)
      findObj.goods_num = goodsNum
    }
  },
  actions: {
    // 1.获取购物车列表数据
    async getCartListAction (context) {
      const resp = await getCartListApi()
      // 后台返回的的购物车列表没有复选框的状态，需要本地进行维护复选框的状态
      // 需要给每一项添加购物车的状态，isChecked: true（默认是选中状态）
      resp.list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', resp)
    },
    // 2.修改某一项商品的数量
    async changeCountAction (context, obj) {
      const { goodsNum, goodsId, goodsSkuId } = obj
      // 先本地修改，本地vuex需要同步更新商品数量
      context.commit('changeCount', { goodsId, goodsNum })
      // 紧接着，调用接口修改数据库中的商品数量
      await changeCountApi(goodsId, goodsNum, goodsSkuId)
    },
    // 3.删除选中的商品列表
    async delSelectAction (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      // 调用api
      await delSelectApi(cartIds)
      // 删除成功
      Toast('删除成功!')

      // 删除成功后，重新获取购物车数据
      context.dispatch('getCartListAction')
    }
  },
  getters: {
    // 购物车总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked === true)
    },
    // 选中的总数（依托于选中的商品项）(getters的第二个参数可以接受其他getters作为参数)
    selCartTotal (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中的商品总价
    selCartPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num * item.goods.goods_price_min, 0)
    },
    // 全选按钮的状态
    selAll (state, getters) {
      return state.cartList.every(item => item.isChecked)
    }
  }

}
