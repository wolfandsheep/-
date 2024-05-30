<template>
  <div class="count-box">
    <button class="minus" @click="handlerSub()">-</button>
    <input type="text " :value="value" @change="handlerChange">
    <button class="add" @click="handlerAdd()">+</button>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 2
    }
  },
  methods: {
    // 通知父组件修改数据
    handlerSub () {
      if (this.value - 1 <= 0) return
      this.$emit('input', this.value - 1)
    },
    // 通知父组件修改数据
    handlerAdd () {
      this.$emit('input', this.value + 1)
    },
    // 手动输入数据
    handlerChange (e) {
      // 如果是负数，转成正数； 如果是string类型，转成number类型。
      const numValue = +Math.abs(e.target.value)

      // 如果上面转换失败，可能出现的情况NaN。
      if (isNaN(numValue)) {
        e.target.value = 1
        this.$emit('input', 1)
        return
      }
      e.target.value = numValue
      this.$emit('input', numValue)
    }
  }
}
</script>

<style lang="less" scoped>
.count-box {
  display: flex;
  width: 110px;
  height: 30px;

  .minus,
  .add {
    width: 30px;
    height: 30px;
    border: none;
    outline: none;
  }
  input {
    width: 40px;
    height: 30px;
    line-height: 30px;
    margin: 0 5px;
    text-align: center;
    border: none;
    outline: none;
    background-color: #f0f0f0;
  }
}
</style>
