<template>
  <div class="p-t-20" :class="!mode && 'bg'">
    <div class="m-b-26 flex answer-box">
      <img
        class="m-r-6 parsing-img"
        src="~@img/driving-range/parsing/right-answer.png"
        alt=""
      />
      <span>正确答案</span>
      <!-- 判断题答案 -->
      <span class="answer m-l-12" v-if="topic.type === 'TF'">{{ textTF }}</span>
      <!-- 单选/多选答案 -->
      <template v-else>
        <!-- 班课答案接口返回（'A'），  -->
          <span v-if="$route.query.fm === 'stuClass'" class="answer m-l-12">
            {{ topic.answer }}
          </span>
        <!-- 练习场答案接口返回正确的选项id -->
        <div v-else>
          <span class="answer m-l-12" v-for="item in parsingSort" :key="item">
            {{ String.fromCharCode(65 + item) }}
          </span>
        </div>
      </template>
    </div>
    <!-- 题目难度 -->
    <div class="m-b-26 flex answer-box">
      <img
        class="m-r-6 parsing-img"
        src="~@img/driving-range/parsing/questions.png"
        alt=""
      />
      <span class="m-r-10">题目难度</span>
      <!-- 五角星  带颜色 -->
      <img
        v-for="(i, index) in new Array(topic.complexity)"
        :key="index"
        class="complexity-img"
        src="~@img/driving-range/parsing/parsing-collect.png"
        alt=""
      />
      <!-- 五角星 不带颜色 -->
      <img
        v-for="(i, index) in new Array(5 - topic.complexity)"
        :key="index + topic.complexity"
        class="complexity-img"
        src="~@img/driving-range/parsing/parsing-uncollect1.png"
        alt=""
      />
    </div>
    <!-- 答案解析 -->
    <div class="m-b-26 flex answer-box">
      <img
        class="m-r-6 parsing-img"
        src="~@img/driving-range/parsing/windsurf.png"
        alt=""
      />答案解析
    </div>
    <div v-html="topic.analysis" class="analysis"></div>
  </div>
</template>

<script>
import { judgeOption } from '@e/public-data.js'; // 判断题选项
export default {
  props: {
    topic: {
      // 题目描述
      type: Object,
      required: true
    },

    parsingSort: {
      // 正确答案序号
      type: Array,
      required: true
    },

    // 练习模式 (普通模式为true)
    mode: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    // 判断题答案
    textTF () {
      const obj = judgeOption.find((item) => {
        return item.value === this.topic.answer;
      });
      return obj.label;
    }
  }
};
</script>

<style lang="stylus" scoped>
.bg {
  width: 644px;
  height: 244px;
  background: linear-gradient(180deg, #F5F9FF 0%, #FFFFFF 100%);
  margin-left: -24px;
  padding-left: 24px;
}

.answer-box {
  align-items: center;

  .answer {
    position: relative;
    top: 2px;
    font-size: 20px;
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    color: #FF7D33;
  }

  .parsing-img {
    width: 16px;
    height: 16px;
  }

  .complexity-img {
    width: 24px;
    height: 24px;
  }
}

img {
  vertical-align: middle;
}

.analysis {
  font-family: Source Han Sans CN-Regular, Source Han Sans CN;
  font-weight: 400;
  color: #6A7487;
}
</style>
