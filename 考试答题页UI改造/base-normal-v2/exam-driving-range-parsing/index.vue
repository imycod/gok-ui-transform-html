<template>
  <div v-if="Object.keys(parsingData).length" class="parsing">
    <!-- 对话框 -->
    <gok-dialog-text
      v-if="dialogFlag"
      title="还有题目尚未作答"
      contentText="练习不易，且考且珍惜~"
      cancel="继续答题"
      confirm="提交"
      :titleImg="infoImg"
      @ok="ok"
      @cancel="cancel"
    />
    <!-- 顶部布局组件 -->
    <driving-range-details-top
      :title="parsingData.titleName"
    >
      <button
        v-if="parsingData.list.length"
        class="button-top center"
        slot="r"
        @click="submit"
      >
        提交
      </button>
    </driving-range-details-top>
    <!-- 内容区 -->
    <div class="content p-t-88">
      <div class="auto flex">
        <!-- 解析卡片 -->
        <div class="content-card p-t-20">
          <template>
            <parsing-card
              v-for="(item, index) in parsingData.list"
              :key="item.id"
              :item="item"
              :index="index"
              :routeObj="routeObj"
              :mode="true"
            />
          </template>
        </div>
        <!-- 右边内容 -->
        <div class="r m-l-32">
          <!-- 用户答题情况 -->
          <div
            v-if="
              Object.keys(resultList).length && !routeObj.requireNum
            "
          >
            <answer-case :resultList="resultList" />
          </div>
          <!-- 占位，稳定布局 -->
          <div v-else class="perch"></div>


        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DrivingRangeDetailsTop from './driving-range/driving-range-details-top.vue'; // 顶部布局组件
import ParsingCard from './driving-range/parsing-card.vue'; // 题目卡片组件
import AnswerCase from './driving-range/parsing/answer-case.vue'; // 用户答题情况组件
import ParsingSheet from './driving-range/parsing/parsing-sheet.vue'; // 答题卡组件

import infoImg from '@img/driving-range/dialog-info.png';

export default {
  props:{
    parsingData:{
      type:Object,
      default:{},
      required:true,
    },
    routeObj:{
      type:Object,
      default:{},
      required:true,
    },
  },
  components: { DrivingRangeDetailsTop, ParsingCard, AnswerCase, ParsingSheet },

  data () {
    return {
      resultList: {},
      infoImg,
      currentIndex: 0, // 当前题目索引
      typeObj: {
        1: '错题',
        2: '收藏'
      },
      currentFixed: true, // 当前是否固定
      dialogFlag: false, // 弹窗
      lastTopic: false // 是否是最后一题
    };
  },

  computed: {


    // 错题和收藏 （头部显示）
    type () {
      return this.typeObj[this.routeObj.type];
    },
  },

  mounted () {

  },

  // 组件注销，清除vux的idArr数据，防止影响下次组件答题卡的渲染
  beforeDestroy () {

  },

  methods: {
    async getData () {

    },

    // 获取题目的数据（答案页面）
    async getParsingData () {

    },


    // 获取题目（答题页面）
    async getAnswer () {

    },


    nextQuestion () {

    },

    lastOption () {

    },

    // 完成练习
    submit () {
      const idArr = this.idArr
      const flag = idArr.every(
        item => item.selectId.length);
      if (!flag || idArr.length !== this.parsingData.topics.length) {
        return (this.dialogFlag = true);
      }
      this.ok();
    },

    // 弹窗关闭
    cancel () {
      this.dialogFlag = false;
    },

    // 弹窗确定
    async ok () {

    }
  }
};
</script>

<style lang="stylus" scoped>
.parsing {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  // width: 1440px;

  .button-top {
    width: 64px;
    height: 32px;
    background: $base;
    border-radius: 4px;
    color: #fff;
    border: none;
    cursor: pointer;
  }

  .content {
    // height: calc(100vh);
    background: #F9FAFC;
    display: flex;
    justify-content: center;

    .auto {
      width: 1006px;
      height: calc(100vh - 100px);
      overflow: auto;
      align-items: flex-start;

      .content-card {
        width: 644px;
        // overflow: auto;
      }

      .scroll {
        height: 1px;
        // border: 1px solid #ccc;
      }

      .perch {
        width: 304px;
        height: 1px;
      }

      .fixed {
        position: fixed;
        top: 110px;
      }
    }
  }
}

// 隐藏滚动条
::-webkit-scrollbar {
  display: none;
}
</style>
