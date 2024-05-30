<template>
  <div class="cart">
    <van-nav-bar title="购物车" fixed />

    <div v-if="token && cartList.length > 0">
      <!-- 购物车开头 -->
      <div class="cart-title">
        <span class="all">共<i>{{ cartTotal }}</i>件商品</span>
        <span class="edit" @click="isEdit=!isEdit">
          <van-icon name="edit" />
          编辑
        </span>
      </div>

      <!-- 购物车列表 -->
      <div class="cart-list">
        <div class="cart-item" v-for="item in cartList" :key="item.goods_id">
          <van-checkbox :value="item.isChecked" @click="toggleCheck(item.goods_id)"></van-checkbox>
          <div class="show">
            <img :src="item.goods.goods_image" alt="">
          </div>
          <div class="info">
            <span class="tit text-ellipsis-2">{{item.goods.goods_name}}</span>
            <span class="bottom">
              <div class="price">¥ <span>{{ item.goods.goods_price_min }}</span></div>
              <CountBox @input="(value) => changeCount(value, item.goods_id, item.goods_sku_id)" :value="item.goods_num"></CountBox>
            </span>
          </div>
        </div>
      </div>

      <div class="footer-fixed">
        <div class="all-check">
          <van-checkbox :value="selAll" @click="changeCheck" icon-size="18"></van-checkbox>
          全选
        </div>

        <div class="all-total">
          <div class="price">
            <span>合计：</span>
            <span>¥ <i class="totalPrice">{{ selCartPrice.toFixed(2) }}</i></span>
          </div>
          <div v-if="!isEdit" :class="{disabled: selCartTotal === 0}" class="goPay">结算({{ selCartTotal }})</div>
          <div v-else @click="delSelect" class="delete" :class="{disabled: selCartTotal === 0}">删除</div>
        </div>
      </div>
    </div>
    <div class="empty-cart" v-else>
      <img src="@/assets/empty.png" alt="">
      <div class="tips">
        您的购物车是空的, 快去逛逛吧
      </div>
      <div class="btn" @click="$router.push('/')">去逛逛</div>
    </div>

  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'CartPage',
  components: {
    CountBox: () => import('@/components/CountBox')
  },
  data () {
    return {
      isEdit: false // 是否正在编辑
    }
  },
  computed: {
    ...mapState('cart', ['cartList']),
    ...mapGetters('cart', [
      'cartTotal',
      'selCartTotal',
      'selCartPrice',
      'selAll',
      'selCartList'
    ]),
    // 是否登录
    token () {
      return this.$store.getters.token
    }
  },
  watch: {
    isEdit (newValue) {
      // 如果编辑状态变成了isEdit=true，表示进入删除商品状态，默认就全部不勾选
      if (newValue === true) {
        // 让全选按钮变成false
        this.$store.commit('cart/allCheck', true)
      } else {
        this.$store.commit('cart/allCheck', false)
      }
    }
  },
  created () {
    // 获取购物车列表数据(调用actions,但必须是登录的用户才能获取)
    if (this.$store.getters.token) {
      this.$store.dispatch('cart/getCartListAction')
    }
  },
  methods: {
    // 1.修改商品选中状态
    toggleCheck (goodsId) {
      this.$store.commit('cart/toggleCheck', goodsId)
    },
    // 2.点击全选按钮
    changeCheck () {
      this.$store.commit('cart/allCheck', this.selAll)
    },
    // 3.修改商品数量
    changeCount (goodsNum, goodsId, goodsSkuId) {
      // 调用action进行修改
      this.$store.dispatch('cart/changeCountAction', {
        goodsNum,
        goodsId,
        goodsSkuId
      })
    },
    // 4.删除选中的商品
    delSelect () {
      console.log(this.selCartList.length)
      if (this.selCartList.length === 0) return

      // 调用action，删除商品列表
      this.$store.dispatch('cart/delSelectAction')
    }
  }
}
</script>

<style lang="less" scoped>
// 主题 padding
.cart {
  padding-top: 46px;
  padding-bottom: 100px;
  background-color: #f5f5f5;
  min-height: 100vh;
  .cart-title {
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    font-size: 14px;
    .all {
      i {
        font-style: normal;
        margin: 0 2px;
        color: #fa2209;
        font-size: 16px;
      }
    }
    .edit {
      .van-icon {
        font-size: 18px;
      }
    }
  }

  .cart-item {
    margin: 0 10px 10px 10px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    background-color: #ffffff;
    border-radius: 5px;

    .show img {
      width: 100px;
      height: 100px;
    }
    .info {
      width: 210px;
      padding: 10px 5px;
      font-size: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .bottom {
        display: flex;
        justify-content: space-between;
        .price {
          display: flex;
          align-items: flex-end;
          color: #fa2209;
          font-size: 12px;
          span {
            font-size: 16px;
          }
        }
        .count-box {
          display: flex;
          width: 110px;
          .add,
          .minus {
            width: 30px;
            height: 30px;
            outline: none;
            border: none;
          }
          .inp {
            width: 40px;
            height: 30px;
            outline: none;
            border: none;
            background-color: #efefef;
            text-align: center;
            margin: 0 5px;
          }
        }
      }
    }
  }
}

.footer-fixed {
  position: fixed;
  left: 0;
  bottom: 50px;
  height: 50px;
  width: 100%;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  .all-check {
    display: flex;
    align-items: center;
    .van-checkbox {
      margin-right: 5px;
    }
  }

  .all-total {
    display: flex;
    line-height: 36px;
    .price {
      font-size: 14px;
      margin-right: 10px;
      .totalPrice {
        color: #fa2209;
        font-size: 18px;
        font-style: normal;
      }
    }

    .goPay,
    .delete {
      min-width: 100px;
      height: 36px;
      line-height: 36px;
      text-align: center;
      background-color: #fa2f21;
      color: #fff;
      border-radius: 18px;
      &.disabled {
        background-color: #ff9779;
      }
    }
  }
}

// 空购物车
.empty-cart {
  padding: 80px 30px;
  img {
    width: 140px;
    height: 92px;
    display: block;
    margin: 0 auto;
  }
  .tips {
    text-align: center;
    color: #666;
    margin: 30px;
  }
  .btn {
    width: 110px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    background-color: #fa2c20;
    border-radius: 16px;
    color: #fff;
    display: block;
    margin: 0 auto;
  }
}
</style>
