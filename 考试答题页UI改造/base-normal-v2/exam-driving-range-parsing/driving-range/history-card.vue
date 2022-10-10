<template>
  <div class="box p-b-16 p-t-16">
    <p class="m-b-4">{{ item.practiceName }}</p>
    <div>
      <span class="m-r-8">{{ newTime }}</span>
      <span v-if="item.isComplete"
        >总共{{ item.topicCnt }}题，答对{{ item.correctCnt }}题</span
      >
      <span v-else class="unfinished">未完成</span>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
export default {
  props: {
    item: {
      // 练习历史数据
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // 时间戳转换为日期格式
    newTime () {
      return dayjs(Number(this.item.createTime)).format('YYYY.MM.DD HH:mm');
    }
  }
};
</script>

<style lang="stylus" scoped>
.box {
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  border-bottom: 1px solid #F0F2F7;
  cursor: pointer;

  &:first-child {
    padding-top: 0;
  }

  &:hover {
    p {
      color: $base;
    }
  }

  p {
    color: #333333;
  }

  span {
    color: #6A7487;
  }

  .unfinished {
    color: $base;
  }
}

</style>
