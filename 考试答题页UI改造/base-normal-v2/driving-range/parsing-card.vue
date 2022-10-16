<template>
  <div class="card m-b-24" :id="index">
    <p class="m-b-16 testType between">
      {{ index + 1 }}.{{ testType }}
      <!-- 答题才有这张图片 -->
      <template v-if="requireNum">
      <!-- <template v-if="requireNum && mode"> -->
        <!-- 是否收藏过 （点击不收藏 0） -->
        <!-- <img
          v-if="isCollect"
          src="~@img/driving-range/parsing/parsing-collect.png"
          alt=""
          @click="collect(0)"
        /> -->
        <!-- 点击收藏 1 -->
        <!-- <img
          v-else
          src="~@img/driving-range/parsing/parsing-uncollect.png"
          alt=""
          @click="collect(1)"
        /> -->
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
    <!-- 训练模式，选完之后，答案错误显示下一题 /   训练模式，解析页面显示下一题,如果是最后一题，就不显示 -->
<!--    <button-->
<!--      class="center m-b-12"-->
<!--      v-if="(!mode && isSelect) || (!requireNum && !mode && !lastOption)"-->
<!--      @click="nextQuestion"-->
<!--    >-->
<!--      {{ lastOption && requireNum ? "提交" : "下一题" }}-->
<!--    </button>-->
    <!-- 多选，训练模式，答题 -->
    <button class="center m-b-12" v-if="confirmAnswer" @click="submitOption">
      确认答案
    </button>
    <!-- 没有抽题数量，说明是来看答案的，展示答案 -->
    <div
      v-if="!requireNum || showParsing"
      class="answer-card p-t-16"
      :class="mode && !requireNum && 'dashed'"
    >
      <answer-details :topic="item" :parsingSort="parsingIndex" :mode="mode" />
    </div>
  </div>
</template>

<script>
import OptionsCard from './parsing/options-card.vue'; // 单选题选项卡
import AnswerDetails from './parsing/answer-details.vue'; // 题目答案
import JudgeCard from './parsing/judge-card.vue'; // 判断题选项卡

// import TEST_TOPIC_TYPE from '@e/test-topic-type.js'; // 获取练习题目
// import { judgeOption } from '@e/public-data.js'; // 判断题选项
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
    item: {
      handler (newVal) {
        // 训练模式收藏，解决点击答题卡，收藏图片不更新的问题
        const index = this.collectArr.findIndex(item => item.id === newVal.id);
        this.isCollect = index !== -1 ? this.collectArr[index].flag : newVal.isCollect;

        // 训练模式，判断当前题目是否展示答案（练习记录进来的，重新答题）
        let selectId = []
        // 之前答题选中状态
        if (newVal.type === 'TF') {
          selectId = []
          newVal.stuAnswer && selectId.push(newVal.stuAnswer)
        } else {
          selectId = []
          newVal.options.forEach(i => {
            if (i.selected) {
              selectId.push(i.optionId)
            }
          })
        }
        let flag
        const obj = this.idArr.find(item => item.id === newVal.id)
        if (this.requireNum && !this.mode) {
          if (!newVal.stuAnswer && obj?.selectId?.length) {
            return this.$store.commit('parsing/setSelect', true)
          }
          if (newVal.stuAnswer) {
            flag = this.myAnswer()
            this.$store.commit('parsing/setSelect', true)
            return this.getIdArr({ selectId, id: newVal.id, sort: newVal.sort, flag })
          }
        }
        // 防止getIdArr调用影响他下面的if语句
        this.$store.commit('parsing/setSelect', false)
        console.log(selectId, 'obj');
        this.getIdArr({ selectId: obj?.selectId || [], id: newVal.id, sort: newVal.sort, flag })
      },
      immediate: true
    }
  },

  created () {
    // 班课答题 就算没答案也要提交空数组
    if (this.$route.query.fm === 'stuClass') {
      if (this.requireNum) {
        this.getIdArr({ selectId: [], id: item.id, sort: item.sort })
      } else {
        // 班课并且是来看答案的
        this.$store.dispatch('parsing/getClassFlag', this.item)
      }
    }
  },

  beforeDestroy () {
    this.$store.commit('parsing/setClassFlag', [])
  },

  methods: {
    ...mapActions('parsing', ['getIdArr']),
    // 展示A B C D
    fromCharCode (sort) {
      return String.fromCharCode(65 + sort);
    },

    // 正确答案
    answer (isParsingSort) {
      const sortArr = [];
      // 正确答案（单选和多选）
      const answerArr = this.item.answer.split(',');
      this.item.options.forEach((i, index) => {
        // 判断正确答案是否在选项中
        if (answerArr.includes(i.optionId)) {
          // 如果在，取出对应的序号(sort可能不是从0开始，ABCD可能会从B开始排序, index不会乱)
          isParsingSort ? sortArr.push(i.sort) : sortArr.push(index);
        }
      });
      return sortArr;
    },
    // 我的答案是否正确
    myAnswer (myAnswerDrill) {
      // 我的答案 （训练模式，并且是刷题状态，查看答题是否正确）
      const myAnswerArr = myAnswerDrill || this.item.stuAnswer.split(',');
      // 正确答案
      const answerArr = this.item.answer.split(',');
      // 我的答案是否正确
      if (myAnswerArr.length === answerArr.length) {
        let flag = true;
        myAnswerArr.forEach((item) => {
          // 错误答案
          !answerArr.includes(item) && (flag = false);
        });
        return flag;
      }
      // 错误答案
      return false;
    },

    async replaceIndex (id) {
      // 如果是看答案，不做操作
      if (!this.requireNum) {
        return;
      }
      // 选择选项，判断单选、多选、判断，进行对应的操作（保存当前试卷id和选项id，答题卡需要用到）
      this.selectIdArr(id);
    },

    // 提交答案(普通模式 / 训练模式单选题和判断题，多选题另行操作)
    async submitOption () {
      const selectId = [...this.selectId]
      const InterfaceObj = {
        // 每一题提交答案的接口参数
        practicePaperId:
          this.routeObj.practicePaperId || this.routeObj.practiceId, // 练习试卷id
        stuPracticeId: this.routeObj.stuPracticeId, // 学生练习id
        practiceTopicId: this.item.id, // 题目id
        stuAnswer: selectId, // 学生答案
        type: this.item.type, // 题目类型
        knowledgeId: this.item.knowledgeId // 知识点id
      };
      // 班课进来答题就不提交答案
      !this.$route.query.fm &&
        (await this.$one.uc.http.post(this.$API.TAC.postComplete, {
          data: InterfaceObj
        }));

      // 比较答案是否正确
      console.log(this.selectId);
      const flag = this.myAnswer(selectId);
      !selectId.length && !this.mode && selectId.push(1)
      this.getIdArr({ selectId: selectId, id: this.item.id, flag, sort: this.item.sort });
      !this.mode && this.currentIsSelect(flag);
    },

    selectIdArr (id) {
      // let flag = false;
      if (this.item.type === 'MULTI') {
        // 多选题重复点击选项，则取消选中
        if (this.selectId.includes(id)) {
          this.selectId.splice(this.selectId.indexOf(id), 1);
        } else {
          this.selectId.push(id);
        }
        // 普通模式进行操作，  训练模式 则不做操作
        if (this.mode) {
          // 提交答案
          // this.submitOption();
        }
      } else {
        // 单选题或者判断题
        this.selectId.splice(0, 1, id);
        // 提交答案
        // this.submitOption();
      }
    },

    // 比较用户选择的答案是否正确（训练模式,单选）
    currentIsSelect (flag) {
      if (flag) {
        this.nextQuestion()
      } else {
        this.$store.commit('parsing/setSelect', true);
        this.lastOption && this.$emit('lastOption', true);
        !this.lastOption && this.$emit('lastOption', false);
      }
      // 比较答案是否正确（训练模式）
      return flag;
    },

    // 下一题
    nextQuestion () {
      if (!this.mode && this.requireNum) {
        this.$store.commit('parsing/setSelect', false);
        // 训练模式、多选题，不清空会影响下一题的选择
        this.selectId = [];
      }
      this.$emit('nextQuestion');
    },

    // 收藏
    async collect (flag) {
      if (this.$route.query.fm !== 'stuClass') {
        await this.$one.uc.http.post(this.$API.TAC.postCollect, {
          data: {
            practiceTopicId: this.item.id,
            knowledgeId: this.item.knowledgeId,
            collectedFlag: flag
          }
        });
        // this.$Message.success('操作成功，请至【错题·收藏】查看');
      }
      this.isCollect = !this.isCollect;
      this.getIdArr({ flag, id: this.item.id });
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
