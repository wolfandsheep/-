<template>
  <div class="login">
    <van-nav-bar title="会员登录" left-arrow @click-left="$router.go(-1)" />

    <div class="container">
      <div class="title">
        <h3>手机号登录</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input class="inp" v-model="mobile" maxlength="11" placeholder="请输入手机号码" type="text">
        </div>
        <div class="form-item">
          <input class="inp" v-model="picCode" maxlength="5" placeholder="请输入图形验证码" type="text">
          <img v-if="picUrl" :src="picUrl" @click="getPicCode()">
        </div>
        <div class="form-item">
          <input class="inp" v-model="smsCode" placeholder="请输入短信验证码" type="text">
          <button @click="getCode">
            {{ second >= totalSecond ? '获取验证码' : `还剩下${second}秒` }}
          </button>
        </div>
      </div>

      <div class="login-btn" @click="login">登录</div>
    </div>
  </div>
</template>

<script>
// 导入请求模块
import { getPicCodeApi, getSmsCaptchaApi, loginApi } from '@/api/login.js'
export default {
  name: 'LoginIndex',
  data () {
    return {
      mobile: '', // 手机号
      picCode: '', // 用户输入的图形验证码
      picKey: '', // 图形验证码的key
      picUrl: '', // 图形验证码url
      totalSecond: 10, // 倒计时总时间
      second: 10, // 当前的倒计时时间
      timerId: null, // 计时器节流阀
      smsCode: '' // 短信验证码
    }
  },
  computed: {
    backUrl () {
      return this.$route.query.backUrl
    }
  },
  created () {
    // 获取图形验证码
    this.getPicCode()
  },
  methods: {
    // 1.获取图形验证码
    async getPicCode () {
      const resp = await getPicCodeApi()
      const { base64: picUrl, key: picKey } = resp
      this.picUrl = picUrl
      this.picKey = picKey
    },
    // 2.获取短信验证码
    async getCode () {
      // (1) 校验手机号、验证码
      if (!this.valiFn()) return

      // (2) 获取短信验证码
      await getSmsCaptchaApi(this.picCode, this.picKey, this.mobile)
      this.$toast('短信已发送,请注意查收 !')

      // (3) 倒计时效果
      // 如果开了定时器，就不能再开了，需要return
      if (this.timerId) return
      this.timerId = setInterval(() => {
        // 如果时间小于0了，就要结束倒计时了。
        if (this.second <= 0) {
          this.second = this.totalSecond
          clearInterval(this.timerId)
          this.timerId = null
          return
        }
        // 时间--
        this.second--
      }, 1000)
    },
    // 3.校验手机号、验证码
    valiFn () {
      // 校验手机号
      if (!/^1[3-9]\d{9}/.test(this.mobile)) {
        this.$toast('手机号格式不正确')
        return false
      }
      // 校验验证码
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('验证码格式不正确')
        return false
      }
      return true
    },
    // 4.登录
    async login () {
      // 重新校验手机号、验证码
      if (!this.valiFn()) return
      // 校验短信验证码格式
      if (!/^\d{6}/.test(this.smsCode)) {
        this.$toast('请输入正确的短信验证码')
        return
      }
      // 校验短信验证码
      const resp = await loginApi(this.mobile, this.smsCode)

      // 将用户信息存入vuex
      this.$store.commit('user/setUserInfo', resp)

      // 跳转（不一定是要跳转到首页，也可能是回到它原来登陆前的页面）
      if (this.backUrl) {
        this.$router.replace(this.backUrl)
      } else {
        this.$router.push('/home')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }

  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg, #ecb53c, #ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
