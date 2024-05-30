import request from './request'

// 1.获取图形验证码
export function getPicCodeApi () {
  return request.get('/captcha/image')
}

// 2.获取短信验证码
export function getSmsCaptchaApi (captchaCode, captchaKey, mobile) {
  return request.post('/captcha/sendSmsCaptcha', {
    form: {
      captchaCode, // 验证码
      captchaKey, // 验证码唯一标识
      mobile // 手机号
    }
  })
}

// 3.登录
export function loginApi (mobile, smsCode) {
  return request.post('/passport/login', {
    form: {
      isParty: false, // 是否第三方登录
      mobile, // 手机号
      partyData: {}, // 三方登录信息
      smsCode // 短信验证码
    }
  })
}
