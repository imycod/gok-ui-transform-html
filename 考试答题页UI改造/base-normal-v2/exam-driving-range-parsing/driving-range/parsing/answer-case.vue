<template>
  <div class="card m-t-20 m-b-20">
    <div class="top">
      <img class="avatar" v-image-err.avatar="getUserBaseInfo.av" />
      <span class="m-l-12">{{ list.name }}</span>
    </div>
    <div class="answer flex column">
      <div class="img center m-b-18">答题情况</div>
      <img class="bg_info" :src="bgInfo" alt="">
      <ul class="between">
        <li>
          <span>抽取题数：</span>
          <span>{{ list.totalTopics }}</span>
        </li>
        <li>
          <span>正确题数：</span>
          <span>{{ list.correctCnt }}</span>
        </li>
        <li>
          <span>错误题数：</span>
          <span>{{ list.wrongCnt }}</span>
        </li>
        <li>
          <span>提交时间：</span>
          <span class="base">{{ submitTime }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import bgInfo from '@img/driving-range/bg_info.png'
export default {
  props: {
    // 答题情况
    resultList: {
      type: Object,
      required: true
    }
  },

  data () {
    return {
      bgInfo,
      // 默认练习场过来的 （班课和练习场接口返回的字段名不一样，需要处理）
      list: this.resultList
    };
  },

  computed: {
    submitTime () {
      // 班课结的提交时间
      if (this.$route.query.fm === 'stuClass') {
        return dayjs(Number(this.resultList.submitTime)).format(
          'YYYY-MM-DD HH:mm:ss'
        );
      }
      // 练习场的提交时间
      return dayjs(
        Number(this.resultList.startMills) + Number(this.resultList.useMills)
      ).format('YYYY-MM-DD HH:mm:ss');
    },

    getUserBaseInfo () {
      return this.$one.uc.token.getUserBaseInfo()
    }
  },

  created () {

  }
};
</script>

<style lang="stylus" scoped>
.card {
  font-family: Source Han Sans CN-Medium, Source Han Sans CN;

  .top {
    // width: 304px;
    height: 56px;
    background: #f7f9fc;
    border-radius: 10px 10px 0px 0px;
    border: 1px solid #e5e6eb;
    padding: 12px 17px;

    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      vertical-align: middle;
    }

    span {
      font-size: 16px;
      font-weight: 500;
      color: #333333;
    }
  }

  .answer {
    // width: 304px;
    height: 210px;
    background: #FFFFFF;
    border-radius: 0px 0px 10px 10px;
    opacity: 1;
    border: 1px solid #D4D6DD;
    border-top: none;
    padding: 28px 18px 22px 16px;
    position: relative;
    .bg_info {
      position: absolute;
      width: 120px;
      left: 0;
      bottom: 0;
    }
    .img {
      background: url('~@img/driving-range/parsing/answer.png') no-repeat center/cover;
      width: 91px;
      height: 11px;
      font-weight: 500;
      color: #333333;
    }

    ul {
      flex: 1;
      flex-direction: column;
      width: 100%;
      z-index: 2;
      li {
        display: flex;
        justify-content: space-between;

        span {
          font-weight: 500;

          &:nth-child(1) {
            color: #6A7487;
          }

          &:nth-child(2) {
            color: #333333;
          }
        }

        .base {
          color: $base !important;
        }
      }
    }
  }
}
</style>
