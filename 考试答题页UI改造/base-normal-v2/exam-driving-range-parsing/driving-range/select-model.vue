<template>
  <div class="select-box m-r-30 flex">
    <div class="bg-color" :class="isActive && 'active'"></div>
    <img class="model-img" :src="item.img" alt="" />
    <div class="m-l-18 m-r-16">
      <p class="value">{{ item.value }}</p>
      <span>(不限时，{{item.typeChild == 1 ? '全部做完提交后' : '训练过程中可'}}查看答案)</span>
    </div>
    <img
      v-if="isActive"
      src="~@img/driving-range/select.png"
      alt=""
      class="r-t"
    />
    <img v-else src="~@img/driving-range/unselected.png" alt="" class="r-t" />
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    },
    isActive: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style lang="stylus" scoped>
.bg-color, .select-box {
  width: 340px;
  height: 80px;
  border-radius: 10px;
}

.select-box {
  position: relative;
  padding: 12px 20px 12px 24px;
  cursor: pointer;

  .model-img {
    width: 56px;
    height: 56px;
  }

  .bg-color {
    position: absolute;
    left: 0;
    top: 0;
  }

  .r-t {
    position: absolute;
    top: 8px;
    right: 20px;
  }

  .value {
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #333333;
  }

  span {
    font-size: 12px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    color: #8590A6;
  }
}

.active {
  background: $base !important;
  opacity: 0.1;
}
</style>
