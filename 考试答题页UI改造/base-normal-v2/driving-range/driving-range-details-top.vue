<!--
 * @Author: zhouzx zhouzx@goktech.cn
 * @Date: 2022-06-27 12:00:44
 * @LastEditors: zhouzx zhouzx@goktech.cn
 * @LastEditTime: 2022-06-27 20:14:49
 * @FilePath: \college-teaching\src\components\driving-range\driving-range-details-top.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <growth-path-details-top :growth="false">
    <div class="top between" slot="l">
      <div class="flex">
        <img class="m-r-8 top-img" src="~@img/driving-range/practice.png" alt="" />
        <div class="title">{{ title }}</div>
      </div>
      <slot name="r"/>
    </div>
  </growth-path-details-top>
</template>

<script>
import GrowthPathDetailsTop from '@c/growth-path/growth-path-details/growth-path-details-top.vue'; // 顶部布局组件
export default {
  components: { GrowthPathDetailsTop },
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="stylus" scoped>
.top {
  position: absolute;
  left: 50%;
  margin-left: -440px;
  top: 0;
  width: 1018px;
  height: 88px;

  img {
    vertical-align: middle;
  }

  .top-img {
    width: 34px;
    height: 34px;
  }

  .title {
    max-width: 600px;
    font-size: 22px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #131414;
    // 超出部分省略号
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
