<template>
  <div class="box center" :class="!currentIndex && 'border'">
    <div class="img-color center" :style="{ background: item.background }">
      <img :src="item.img" alt="" />
    </div>
    <p class="value">{{ item.knowledgeName }}</p>
    <p class="cnt">{{ item.topicCnt }}</p>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },

    currentIndex: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style lang="stylus" scoped>
.box {
  flex-direction: column;
  width: 50%;
  // padding: 19px 44px 23px 28px;
  cursor: pointer;

  .img-color {
    width: 40px;
    height: 40px;
    // background: linear-gradient(134deg, #6CF4C7 0%, #1DB682 100%);
    border-radius: 8px 8px 8px 8px;

    img {
      width: 20px;
    }
  }

  .value {
    font-size: 20px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #6A7487;
  }

  .cnt {
    font-size: 32px;
    font-family: HarmonyOS Sans SC-Bold, HarmonyOS Sans SC;
    font-weight: bold;
    color: #333333;
  }
}

.border {
  border-right: 1px solid #E5E5E5;
}
</style>
