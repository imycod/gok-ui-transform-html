<template>
  <div class="card m-b-24" :id="index">
    <p class="m-b-16 testType between">
      {{ index + 1 }}.{{ testType }}
      <!-- 答题才有这张图片 -->
      <template v-if="requireNum">
      <!-- <template v-if="requireNum && mode"> -->
        <!-- 是否收藏过 （点击不收藏 0） -->
        <img
          v-if="isCollect"
          src="~@img/driving-range/parsing/parsing-collect.png"
          alt=""
          @click="collect(0)"
        />
        <!-- 点击收藏 1 -->
        <img
          v-else
          src="~@img/driving-range/parsing/parsing-uncollect.png"
          alt=""
          @click="collect(1)"
        />
      </template>
    </p>
    <div class="m-b-26" v-html="item.name"></div>
    <div class="option-card">
      <div>
        <!-- 单选和多选题 -->
        <template v-if="item.type === 'SINGLE' || item.type === 'MULTI'">
          <!-- 查看答案 -->
          <options-card
            ref="optionsCard"
            v-for="(optionsData, index) in item.options"
            :key="optionsData.optionId"
            :id="item.id"
            :optionsData="optionsData"
            :fromCharCode="fromCharCode(index)"
            :parsingSort="parsingSort"
            :myAnswer="myAnswer()"
            :requireNum="requireNum"
            :currentIndex="selectId.includes(optionsData.optionId)"
            @click.native="replaceIndex(optionsData.optionId)"
          />
        </template>
        <!-- 判断题 -->
        <template v-if="item.type === 'TF'">
          <judge-card
            v-for="judge in judgeOption"
            :key="judge.value"
            :judge="judge"
            :item="item"
            :requireNum="requireNum"
            :currentIndex="selectId.includes(judge.value)"
            @click.native="replaceIndex(judge.value)"
          />
        </template>
      </div>
    </div>
    <!-- 没有抽题数量，说明是来看答案的，展示答案 -->

  </div>
</template>

<script>
import OptionsCard from './parsing/options-card.vue'; // 单选题选项卡
import AnswerDetails from './parsing/answer-details.vue'; // 题目答案
import JudgeCard from './parsing/judge-card.vue'; // 判断题选项卡

import TEST_TOPIC_TYPE from '@e/test-topic-type.js'; // 获取练习题目
import { judgeOption } from '@e/public-data.js'; // 判断题选项
import { mapActions, mapState, mapGetters } from 'vuex';
export default {
  components: { OptionsCard, AnswerDetails, JudgeCard },

  props: {
    item: {
      // 题目描述
      type: Object,
      required: true
    },

    index: {
      // 第几题
      type: Number,
      required: true
    },

    // 练习模式 (普通模式为true)
    mode: {
      type: Boolean,
      default: false
    },

    routeObj: {
      // 路由对象
      type: Object,
      required: true
    },

    lastOption: {
      // 是否是最后一题
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      judgeOption, // 判断题选项
      selectId: [], // selectId: 用户选中的选项id（训练模式：给答题卡，改变样式）， id：当前题目id（普通模式：给答题卡，改变样式）
      isCollect: this.item.isCollect, // 是否收藏
      confirmShow: false // 确认答案按钮是否显示
    };
  },

  computed: {
    ...mapState({
      // 是否训练模式，并且在刷题
      isSelect: (state) => state.parsing.isSelect,
      idArr: (state) => state.parsing.idArr,
      collectArr: (state) => state.parsing.collectArr
    }),
    ...mapGetters('parsing', ['isCurrect']),
    // 题目类型
    testType () {
      return TEST_TOPIC_TYPE[this.item.type].name;
    },

    // 正确答案（展示对应图标）
    parsingSort () {
      const sortArr = this.answer(true);
      return sortArr;
    },

    // 正确答案（展示对应答案）
    parsingIndex () {
      const sortArr = this.answer(false);
      return sortArr;
    },

    // 是否有抽题数量
    requireNum () {
      return this.routeObj.requireNum;
    },

    // 多选，训练模式，答题
    confirmAnswer () {
      return (
        !this.mode &&
        this.item.type === 'MULTI' &&
        !this.isSelect &&
        this.requireNum
      );
    },

    // 显示解析页面（训练模式、答题答错了）
    showParsing () {
      return (
        !this.mode && this.isCurrect && !this.isCurrect.flag && this.isSelect
      );
    }
  },

  watch: {

  },

  created () {

  },

  beforeDestroy () {
  },

  methods: {
    ...mapActions('parsing', ['getIdArr']),
    // 展示A B C D
    fromCharCode (sort) {
      return String.fromCharCode(65 + sort);
    },

    // 正确答案
    answer (isParsingSort) {

    },
    // 我的答案是否正确
    myAnswer (myAnswerDrill) {

    },

    async replaceIndex (id) {

    },

    // 提交答案(普通模式 / 训练模式单选题和判断题，多选题另行操作)
    async submitOption () {

    },

    selectIdArr (id) {
    },

    // 比较用户选择的答案是否正确（训练模式,单选）
    currentIsSelect (flag) {

    },

    // 下一题
    nextQuestion () {

    },

    // 收藏
    async collect (flag) {

    }
  }
};
</script>

<style lang="stylus" scoped>
.card {
  padding: 16px 24px;
  background: #fff;

  .testType {
    font-size: 16px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #333333;

    img {
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
  }

  .answer-card {
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    color: #000000;
  }

  .option-card {
    position: relative;
  }

  button {
    position: relative;
    top: 10px;
    left: 518px;
    width: 78px;
    height: 28px;
    background: $base;
    border-radius: 4px;
    border: none;
    color: #fff;
    cursor: pointer;
  }
}

.dashed {
  border-top: 1px dashed #D4D6DD;
}
</style>
