<template>
  <div class="sheet">
    <img class="bg_answer" :src="bgAnswer" alt="">
    <!-- 答题卡头部标题 -->
    <my-activity-top text="答题卡" />
    <!-- 答题卡（标记、未答、正确、错误） -->
    <div class="icon-color flex">
      <icon-color
        v-for="(item, index) in isOrdinary"
        :key="index"
        :item="item"
      />
    </div>
    <!-- 每道题的正确和错误 -->
    <div class="flex grid">
      <div
        class="sheet-grid center m-r-20 m-b-16"
        v-for="(topics, index) in parsingData.topics"
        :key="topics.id"
        :class="style(topics)"
        @click="currentOption(index, topics)"
      >
        <a :href="routeObj.typeChild === '1' ? '#' + index : '#javascript:;'">{{
          index + 1
        }}</a>
        <img
          v-if="isCollect(topics)"
          src="~@img/driving-range/parsing/collect-bg.png"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
import MyActivityTop from '@c/activity-list/my-activity-top.vue'; // 我的活动头部组件
import IconColor from './icon-color.vue'; // 我的活动头部组件
import bgAnswer from '@img/driving-range/bg_answer.png'
import imgTag from '@img/driving-range/parsing/tag.png'; // 标记
export default {
  components: { MyActivityTop, IconColor },

  props: {
    parsingData: {
      // 题目数据
      type: Object,
      required: true
    },

    routeObj: {
      // 练习类型1：普通 2：训练
      type: Object,
      required: true
    }
  },

  data () {
    return {
      bgAnswer,
      topObj: [
        // 查看答案，答题卡显示的数据 (训练模式也可用这个数组渲染)
        {
          name: '标记',
          img: imgTag
          // isTrue: this.routeObj.typeChild === '1'
        },
        {
          name: '未答',
          color: '#fff',
          isTrue: true
        },
        {
          name: '正确',
          color: '#20C092',
          isTrue: true
        },
        {
          name: '错误',
          color: '#F56C6C',
          isTrue: true
        }
      ],
      ordinaryArr: [
        // 普通模式数组刷题，答题卡显示的数据
        {
          name: '未答',
          color: '#fff',
          isTrue: true
        },
        {
          name: '已答',
          color: 'linear-gradient(180deg, #FFBA4E 0%, #FB771A 100%)',
          isTrue: true
        },
        {
          name: '标记',
          img: imgTag,
          isTrue: true
        }
      ]
    };
  },

  computed: {

  },

  methods: {
    // 答题错误
    isError (topics) {
      // 如果为多选，判断用户答案是否与正确答案是否一致
      if (topics.type === 'MULTI') {
        // 我的答案
        const myAnswerArr = topics.stuAnswer.split(',');
        // 正确答案
        const answerArr = topics.answer.split(',');
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
      }
      return topics.answer === topics.stuAnswer;
    },

    // 样式修改
    style (topics) {

    },

    // 是否收藏
    isCollect (topics) {
      const index = this.collectArr.findIndex(item => item.id === topics.id);
      return index !== -1 ? this.collectArr[index].flag : topics.isCollect;
    },

    // 点击答题卡，显示对应的题目
    currentOption (index, topics) {

    }
  }
};
</script>

<style lang="stylus" scoped>
.sheet {
  position: relative;
  width: 330px;
  max-height: 660px;
  min-height: 500px;
  background: linear-gradient(179deg, #E6E8FE 0%, #FFFFFF 30%);
  border-radius: 10px;
  border: 1px solid #E5E6EB;
  padding: 86px 0 10px 20px;
  overflow: hidden;
  .bg_answer {
    position: absolute;
    top: 0;
    right: 0;
    width: 78px;
    z-index: 3;
  }

  .icon-color {
    position: absolute;
    top: 54px;
    right: 12px;
    width: 100%;
    justify-content: flex-end;
    z-index: 2;
  }

  .grid {
    flex-wrap: wrap;
    max-height: 571px;
    overflow-y: auto;

    .sheet-grid {
      position: relative;
      background: #fff;
      border-radius: 4px;
      border: 1px solid #E5E6EB;

      a {
        width: 36px;
        height: 36px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-family: Source Han Sans CN-Medium, Source Han Sans CN;
        font-weight: 500;
        color: #6A7487;
        z-index: 1;
      }

      img {
        position: absolute;
        left: 0;
        top: 0;
        width: 28px;
      }
    }

    .error { // 错误
      background: #F56C6C;
      color: #fff;

      a {
        color: #fff;
      }
    }

    .correct { // 正确
      background: #20C092;
      color: #fff;

      a {
        color: #fff;
      }
    }

    .hand {
      cursor: pointer;
    }

    .answer {
      background: $base;
      color: #fff;

      a {
        color: #fff;
      }
    }
  }
}
</style>
