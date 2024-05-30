/**
 * 组件库按需引入
 */

import Vue from 'vue'
import { Rate, Button, Tabbar, TabbarItem, NavBar, Search, Swipe, SwipeItem, Grid, GridItem, Icon, Lazyload, ActionSheet, Dialog, Checkbox } from 'vant'

// 按钮
Vue.use(Button)
// 标签tab栏（最下面）
Vue.use(Tabbar)
Vue.use(TabbarItem)
// 导航栏（最上面）
Vue.use(NavBar)
// 轮播图
Vue.use(GridItem)
Vue.use(Search)
Vue.use(Swipe)
Vue.use(SwipeItem)
Vue.use(Grid)
// 图标
Vue.use(Icon)
// 懒加载
Vue.use(Lazyload)
Vue.use(Rate)
// 加入购物车弹层
Vue.use(ActionSheet)
// 弹窗
Vue.use(Dialog)
// 复选框
Vue.use(Checkbox)
