<template>
  <div class="box">
    <div class="p-b-14 m-b-8 t">
      <img class="icon m-r-6" :src="img" alt="" />
      <span>{{ item.knowledgeName }}</span>
    </div>
    <img class="m-r-6 icon-bottom" src="~@img/driving-range/icon-topic.png" alt="" />
    <span class="cnt">总题数：{{ item.topicCnt }}</span>
  </div>
</template>

<script>
export default {
  // 图标
  props: {
    img: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style lang="stylus" scoped>
.box {
  width: 310px;
  // height: 88px;
  background: linear-gradient(180deg, #F3F6FA 0%, rgba(255, 255, 255, 0) 100%);
  border-radius: 6px;
  border: 1px solid #F0F2F7;
  margin: 16px 24px 16px 0;
  padding: 14px;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  .icon {
    width: 24px;
    vertical-align: middle;
  }

  .icon-bottom {
    width: 18px;
  }

  .t {
    // 一行显示，超出省略号
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-bottom: 1px solid #E5E6EB;

    span {
      font-family: Source Han Sans CN-Medium, Source Han Sans CN;
      font-weight: 500;
      color: #333333;
    }
  }

  .cnt {
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #8590A6;
  }
}
</style>
