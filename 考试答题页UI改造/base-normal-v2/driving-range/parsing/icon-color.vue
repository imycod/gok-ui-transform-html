<template>
  <div  class="m-r-8 flex">
    <div class="icon m-r-6" :style="{ background: item.color }">
      <img v-if="item.img" :src="item.img" alt="" />
    </div>
    <span class="name">{{ item.name }}</span>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="stylus" scoped>
.icon {
  width: 16px;
  height: 16px;
  border-radius: 2px;
  background: #fff;
  border: 1px solid #E5E6EB;

  img {
    width: 16px;
    height:16px;
  }

  .name {
    font-size: 12px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    font-weight: 400;
    color: #333333;
  }
}
</style>
