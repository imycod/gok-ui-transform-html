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
          <!-- 监听元素滚动 -->
          <div
            v-if="!routeObj.requireNum"
            ref="scroll"
            class="scroll m-b-22"
          ></div>
          <!-- 答题卡 -->
          <div :class="currentFixed && 'fixed'">
            <parsing-sheet
              :parsingData="parsingData"
              :routeObj="routeObj"
              @currentOption="currentOption"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DrivingRangeDetailsTop from './driving-range-details-top.vue'; // 顶部布局组件
import ParsingCard from './parsing-card.vue'; // 题目卡片组件
import AnswerCase from './parsing/answer-case.vue'; // 用户答题情况组件
import ParsingSheet from './parsing/parsing-sheet.vue'; // 答题卡组件

// import infoImg from '@img/driving-range/dialog-info.png';
import { mapState } from 'vuex';

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
      // infoImg,
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
    ...mapState({
      idArr: state => state.parsing.idArr
    }),

    // 错题和收藏 （头部显示）
    type () {
      return this.typeObj[this.routeObj.type];
    },
  },

  mounted () {
    // 成绩报告
    this.routeObj.practiceId && this.getData();
    // 题目数据
    this.routeObj.requireNum && !this.$route.query.num
      ? this.getAnswer()
      : this.getParsingData();
  },

  // 组件注销，清除vux的idArr数据，防止影响下次组件答题卡的渲染
  beforeDestroy () {
    this.$store.commit('parsing/clearIdArr');
    this.$store.commit('parsing/setSelect', false);
  },

  methods: {
    async getData () {
      // 获取成绩报告
      const res = await this.$one.uc.http.get(
        this.$API.TAC.getPracticeList(this.routeObj.practiceId),
        { params: {} }
      );
      this.resultList = res.data;
    },

    // 获取题目的数据（答案页面）
    async getParsingData () {
      const routeObj = this.routeObj;

      const { data: res } = await this.$one.uc.http.post(
        this.$API.TAC.getParsingData,
        {
          data: {
            pageType: this.routeObj.type, // 练习类型（0: tab页面 1：错题 2：收藏页面） type
            practicePaperId: routeObj.practiceId, // 练习试卷id practicePaperId
            knowledgeId: routeObj.knowledgeId // 知识点id knowledgeId
          }
        }
      );
      this.parsingData = res;
      this.routeObj.stuPracticeId = res.stuPracticeId;

      // 监听滚动，固定答题卡
      this.scroll();
    },

    // 监听滚动，固定答题卡
    scroll () {
      this.$nextTick(() => {
        const loading = this.$refs.scroll;
        var observer = new IntersectionObserver((arr) => {
          this.currentFixed = !arr[0].isIntersecting;
        });
        // 调用函数，开始监听
        loading && observer.observe(loading);
      });
    },

    // 获取题目（答题页面）
    async getAnswer () {
      const routeObj = this.routeObj;

      // 练习场获取题目
      const { data: res } = await this.$one.uc.http.post(
        this.$API.TAC.postAnswer,
        {
          data: {
            requireNum: routeObj.requireNum,
            knowledgeId: routeObj.knowledgeId || '',
            type: routeObj.type,
            practiceType: routeObj.typeChild,
            knowledgeName: routeObj.tabName
          }
        }
      ).catch(err => {
        console.dir(err)
        if (err.response.data.code === 500) {
          this.$Message.error(err.response.data.message);
        }
      });
      this.parsingData = res;
      this.routeObj.knowledgeId = res.knowledgeId;
      this.routeObj.practicePaperId = res.practicePaperId;
      this.routeObj.stuPracticeId = res.stuPracticeId;
    },

    // 点击答题卡,查看对应答案
    currentOption (index) {
      // 训练模式点击答题卡，清空子组件的selectId，防止影响下一题数据
      this.$refs.parsingCard.selectId = []
      this.currentIndex = index;
    },
    // 下一题
    nextQuestion () {
      const index = this.currentIndex;
      // 在刷题  没有下一题了
      if (
        this.parsingData.topics.length <= index + 1 &&
        this.routeObj.requireNum
      ) {
        if (this.idArr.length !== this.parsingData.topics.length) {
          this.dialogFlag = this.lastTopic
          this.lastTopic = true
          return this.$store.commit('parsing/setSelect', true)
        }
        return this.submit();
      }
      if (this.parsingData.topics.length <= index + 1) {
        return '';
      }
      this.$store.dispatch('parsing/getIndex', this.parsingData.topics[index + 1])
      // 有下一题
      this.currentIndex = index + 1;
    },

    lastOption (flag) {
      this.lastTopic = flag
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
      const parsingData = this.parsingData;
      const routeObj = this.routeObj;

      // 跳转到成绩报告页面
      this.$router.replace({
        path: '/driving-range/results',
        query: {
          practiceId:
            this.parsingData.practicePaperId || routeObj.stuPracticeId, // 练习试卷id
          knowledgeId: this.parsingData.knowledgeId, // 知识点id
          fm: this.routeObj.fm // 来源
          // type: this.routeObj.type //  练习类型（0: tab页面 1：错题 2：收藏页面） type
        }
      });
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
