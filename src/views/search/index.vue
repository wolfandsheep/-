<template>
  <div class="search">
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />

    <van-search ref="searchRef" show-action placeholder="请输入搜索关键词" v-model="searchContent" clearable>
      <template #action>
        <div @click="search()">搜索</div>
      </template>
    </van-search>

    <!-- 搜索历史 -->
    <div class="search-history" v-if="history.length > 0">
      <div class="title">
        <span>最近搜索</span>
        <van-icon name="delete-o" size="16" @click="delHistory" />
      </div>
      <div class="list">
        <div class="list-item" v-for="item in history" :key="item" @click="search(item)">{{item}}</div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入本地存储
import { getHistory, setHistory } from '@/utils/storage.js'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchContent: '',
      history: getHistory() // 历史记录
    }
  },
  methods: {
    // 1.搜索
    search (searchContent) {
      if (searchContent) this.searchContent = searchContent

      // 如果为空，则不进行任何操作
      if (this.searchContent === '') return

      // 如果已经存在的，就删除当前这个，在前面重新添加
      if (this.history.includes(this.searchContent)) {
        this.history = this.history.filter(item => item !== this.searchContent)
        this.history.unshift(this.searchContent)
      } else {
        this.history.unshift(this.searchContent)
      }

      // 存储到本地
      setHistory(this.history)
      // 跳转到搜索列表页
      this.$router.push(`/searchList?search=${this.searchContent}`)
      // 重置搜索框里的内容
      this.searchContent = ''
    },
    // 删除历史记录
    delHistory () {
      this.history = []
      setHistory([])
    }
  }

}
</script>

<style lang="less" scoped>
.search {
  .searchBtn {
    background-color: #fa2209;
    color: #fff;
  }
  ::v-deep .van-search__action {
    background-color: #c21401;
    color: #fff;
    padding: 0 20px;
    border-radius: 0 5px 5px 0;
    margin-right: 10px;
  }
  ::v-deep .van-icon-arrow-left {
    color: #333;
  }
  .title {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
  }
  .list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 10px;
    gap: 5%;
  }
  .list-item {
    width: 30%;
    text-align: center;
    padding: 7px;
    line-height: 15px;
    border-radius: 50px;
    background: #fff;
    font-size: 13px;
    border: 1px solid #efefef;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-bottom: 10px;
  }
}
</style>
