<template>
  <div class="prodetail">
    <van-nav-bar fixed title="商品详情页" left-arrow @click-left="$router.go(-1)" />

    <van-swipe :autoplay="4000" @change="onChange">
      <van-swipe-item v-for="(image, index) in images" :key="index">
        <img :src="image.external_url" />
      </van-swipe-item>

      <template #indicator>
        <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
      </template>
    </van-swipe>

    <!-- 商品说明 -->
    <div class="info">
      <div class="title">
        <div class="price">
          <span class="now">￥{{ detail.goods_price_min }}</span>
          <span class="oldprice">￥{{ detail.goods_price_max }}</span>
        </div>
        <div class="sellcount">已售{{ detail.goods_sales }}件</div>
      </div>
      <div class="msg text-ellipsis-2">
        {{ detail.goods_name }}
      </div>

      <div class="service">
        <div class="left-words">
          <span><van-icon name="passed" />七天无理由退货</span>
          <span><van-icon name="passed" />48小时发货</span>
        </div>
        <div class="right-icon">
          <van-icon name="arrow" />
        </div>
      </div>
    </div>

    <!-- 商品评价 -->
    <div class="comment">
      <div class="comment-title">
        <div class="left">商品评价 ({{ total }}条)</div>
        <div class="right">查看更多 <van-icon name="arrow" /> </div>
      </div>
      <div class="comment-list">
        <div class="comment-item" v-for="item in commentList" :key="item.comment_id">
          <div class="top">
            <img :src="item.user.avatar_url || defaultImg" alt="">
            <div class="name">{{ item.user.nick_name }}</div>
            <van-rate :size="16" :value="item.score / 3" color="#ffd21e" void-icon="star" void-color="#eee" />
          </div>
          <div class="content">
            {{ item.content }}
          </div>
          <div class="time">
            {{ item.create_time }}
          </div>
        </div>
      </div>
    </div>

    <!-- 商品描述 -->
    <div class="desc" v-html="detail.content"></div>

    <!-- 底部 -->
    <div class="footer">
      <div class="icon-home">
        <van-icon name="wap-home-o" />
        <span @click="$router.push('/home')">首页</span>
      </div>
      <div class="icon-cart" @click="$router.push('/cart')">
        <span v-if="cartTotal > 0" class="num">{{ cartTotal }}</span>
        <van-icon name="shopping-cart-o" />
        <span>购物车</span>
      </div>
      <div class="btn-add" @click="addFn">加入购物车</div>
      <div class="btn-buy" @click="addBuy">立刻购买</div>
    </div>

    <!-- 弹层 -->
    <van-action-sheet v-model="showPannel" :title="mode === 'cart' ? '加入购物车' : '立即购买'">
      <div class="content">
        <van-action-sheet v-model="showPannel" :title="mode === 'cart' ? '加入购物车' : '立刻购买'">
          <div class="product">
            <div class="product-title">
              <div class="left">
                <img :src="detail.goods_image" alt="">
              </div>
              <div class="right">
                <div class="price">
                  <span>¥</span>
                  <span class="nowprice">{{detail.goods_price_min}}</span>
                </div>
                <div class="count">
                  <span>库存</span>
                  <span>{{detail.stock_total}}</span>
                </div>
              </div>
            </div>
            <div class="num-box">
              <span>数量</span>
              <CountBox v-model="addCount"></CountBox>
            </div>
            <div class="showbtn" v-if="detail.stock_total > 0">
              <div class="btn" v-if="mode === 'cart'" @click="addCart">加入购物车</div>
              <div class="btn now" v-else>立刻购买</div>
            </div>
            <div class="btn-none" v-else>该商品已抢完</div>
          </div>
        </van-action-sheet>
      </div>
    </van-action-sheet>
  </div>
</template>

<script>
// 导入API
import { getProDetailApi } from '@/api/product.js'
import { getCommentApi } from '@/api/comment.js'
import { addCartApi } from '@/api/cart.js'
// 导入默认头像
import defaultImg from '@/assets/default-avatar.png'

export default {
  name: 'ProDetail',
  components: {
    CountBox: () => import('@/components/CountBox.vue')
  },
  data () {
    return {
      images: [], // 图片
      current: 0,
      detail: {}, // 商品详情信息
      total: 0, // 评价总数
      limit: 5, // 要显示的评论数量
      commentList: [], // 评价列表
      defaultImg, // 默认头像
      mode: 'cart', // 默认弹层打开的是加入购物车
      showPannel: false, // 控制弹层是否显示
      addCount: 1, // 商品数量
      cartTotal: '' // 购物车总数量(购物车角标)
    }
  },
  computed: {
    // 地址栏参数id
    goodsId () {
      return this.$route.params.id
    }
  },
  created () {
    // 获取商品详情数据
    this.getProDetail()
    // 数据商品的评论数据
    this.getComment()
  },
  methods: {
    // 轮播图滚动需要的函数
    onChange (index) {
      this.current = index
    },
    // 1.获取商品详情数据
    async getProDetail () {
      const resp = await getProDetailApi(this.goodsId)
      this.detail = resp.detail
      this.images = resp.detail.goods_images
    },
    // 2.获取商品评论数据
    async getComment () {
      const resp = await getCommentApi(this.goodsId, this.limit)
      this.commentList = resp.list
      this.total = resp.total
    },
    // 3.加入购物车（按钮）
    addFn () {
      this.mode = 'cart'
      // 打开弹层
      this.showPannel = true
    },
    // 4.立即购买（按钮）
    addBuy () {
      this.mode = 'buynow'
      // 打开弹层
      this.showPannel = true
    },
    // 弹层内的加入购物车（点了要真的加入到购物车）
    async addCart () {
      const token = this.$store.getters.token
      // (1) token不存在的情况
      if (!token) {
        // 弹出提示窗口
        this.$dialog
          .confirm({
            title: '温馨提示',
            message: '此时需要先登录才能继续操作哦',
            confirmButtonText: '去登录',
            cancelButtonText: '再逛逛'
          })
          .then(() => {
            // 确定，去登录页(如果希望登录后跳转回这一页，需要传参,fullpath包含了全部参数)
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {
            // 取消，默认会关闭弹出
          })
        return
      }

      // (2) token存在的情况
      // 调用api，将商品加入购物车
      const resp = await addCartApi(
        this.goodsId,
        this.addCount,
        this.detail.skuList[0].goods_sku_id
      )
      this.cartTotal = resp.cartTotal
      // 关闭弹窗
      this.showPannel = false
    }
  }
}
</script>

<style lang="less" scoped>
.prodetail {
  padding-top: 46px;
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  img {
    display: block;
    width: 100%;
  }
  .custom-indicator {
    position: absolute;
    right: 10px;
    bottom: 10px;
    padding: 5px 10px;
    font-size: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
  }
  .desc {
    width: 100%;
    overflow: scroll;
    ::v-deep img {
      display: block;
      width: 100% !important;
    }
  }
  .info {
    padding: 10px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    .now {
      color: #fa2209;
      font-size: 20px;
    }
    .oldprice {
      color: #959595;
      font-size: 16px;
      text-decoration: line-through;
      margin-left: 5px;
    }
    .sellcount {
      color: #959595;
      font-size: 16px;
      position: relative;
      top: 4px;
    }
  }
  .msg {
    font-size: 16px;
    line-height: 24px;
    margin-top: 5px;
  }
  .service {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    margin-top: 10px;
    font-size: 16px;
    background-color: #fafafa;
    .left-words {
      span {
        margin-right: 10px;
      }
      .van-icon {
        margin-right: 4px;
        color: #fa2209;
      }
    }
  }

  .comment {
    padding: 10px;
  }
  .comment-title {
    display: flex;
    justify-content: space-between;
    .right {
      color: #959595;
    }
  }

  .comment-item {
    font-size: 16px;
    line-height: 30px;
    .top {
      height: 30px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      img {
        width: 20px;
        height: 20px;
      }
      .name {
        margin: 0 10px;
      }
    }
    .time {
      color: #999;
    }
  }
  // 底部
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 55px;
    background-color: #fff;
    border-top: 1px solid #ccc;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .icon-home,
    .icon-cart {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      .van-icon {
        font-size: 24px;
      }
    }
    // 购物车角标
     .icon-cart {
      position: relative;
      padding: 0 6px;
      .num {
        z-index: 999;
        position: absolute;
        top: -2px;
        right: 0;
        min-width: 16px;
        padding: 0 4px;
        color: #fff;
        text-align: center;
        background-color: #ee0a24;
        border-radius: 50%;
      }
    }

    .btn-add,
    .btn-buy {
      height: 36px;
      line-height: 36px;
      width: 120px;
      border-radius: 18px;
      background-color: #ffa900;
      text-align: center;
      color: #fff;
      font-size: 14px;
    }
    .btn-buy {
      background-color: #fe5630;
    }
  }
}

.tips {
  padding: 10px;
}

// 弹层
.product {
  .product-title {
    display: flex;
    .left {
      img {
        width: 90px;
        height: 90px;
      }
      margin: 10px;
    }
    .right {
      flex: 1;
      padding: 10px;
      .price {
        font-size: 14px;
        color: #fe560a;
        .nowprice {
          font-size: 24px;
          margin: 0 5px;
        }
      }
    }
  }

  .num-box {
    display: flex;
    justify-content: space-between;
    padding: 10px;
    align-items: center;
  }

  .btn,
  .btn-none {
    height: 40px;
    line-height: 40px;
    margin: 20px;
    border-radius: 20px;
    text-align: center;
    color: rgb(255, 255, 255);
    background-color: rgb(255, 148, 2);
  }
  .btn.now {
    background-color: #fe5630;
  }
  .btn-none {
    background-color: #cccccc;
  }
}
</style>
