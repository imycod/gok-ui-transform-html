<template>
  <div class="options m-b-24" :class="style">
    <!-- A B C D -->
    <div class="round center" :class="currentIndex && 'round-active'">
      {{ fromCharCode }}
    </div>
    <!-- 选项 -->
    <div class="option-text">{{ optionsData.option }}</div>
    <!--  v-if="!requireNum"(不是刷题的) -->
    <div v-if="!requireNum || isSelect">

      <!-- 错误的图片 -->
      <img
        v-if="isError"
        class="icon error-icon"
        src="~@img/driving-range/parsing/error-icon.png"
        alt=""
      />
      <!-- 正确的图片 -->
      <img
        v-if="isCorrect"
        class="icon"
        src="~@img/driving-range/parsing/correct-icon.png"
        alt=""
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  props: {
    // A B C D
    fromCharCode: {
      type: String,
      required: true
    },

    // 选项列表
    optionsData: {
      type: Object,
      required: true
    },

    parsingSort: {
      // 正确答案标识
      type: Array,
      required: true
    },

    myAnswer: {
      // 用户答案
      type: Boolean,
      required: true
    },

    requireNum: {
      // 答题数量（用于判断是否展示答案）
      type: String,
      required: true
    },

    currentIndex: {
      // 是否是当前选中的选项
      type: Boolean,
      required: true
    },

    // 题目id
    id: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      active: false // 单击选项时，是否选中
    };
  },

  computed: {
    ...mapState({
      // 是否是刷题模式,并且是训练模式
      isSelect: (state) => state.parsing.isSelect,
      idArr: (state) => state.parsing.idArr
    }),
    ...mapGetters('parsing', ['isCurrect']),

    isClass () {
      return this.$route.query.fm === 'stuClass'
    },

    // 是正确的选项
    parsingFlag () {
      if (this.isClass) {
        return this.optionsData.flag
      }
      return this.parsingSort.includes(this.optionsData.sort);
    },

    // 当前选项在答案数组中
    parsingFlagId () {
      return this.isCurrect && this.isCurrect.selectId.includes(this.optionsData.optionId);
    },

    // 用户答对了,并且选中的选项(正确的选项被选中也显示正确图标)
    isCorrect () {
      if (this.isSelect) {
        return this.parsingFlag && this.parsingFlagId;
      }
      return this.parsingFlag && this.optionsData.selected;
    },

    // 用户这题答错了，并且选中了选项，此时显示错误的图标img（避免多选出bug）(多选题，只要答错了，正确的选项被选中也显示错误图标)
    isError () {
      if (this.isClass) {
        // const flag = !this.parsingFlag && this.optionsData.selected;
        // flag && this.$store.commit('parsing/setClassFlag', this.id);
        return !this.parsingFlag && this.optionsData.selected;
      }
      if (this.isSelect) {
        return this.parsingFlagId && !this.isCurrect.flag;
      }
      return !this.myAnswer && this.optionsData.selected;
    },

    style () {
      if (this.requireNum && !this.isSelect) {
        // 刷题的样式
        return { hand: this.requireNum, active: this.currentIndex };
      }
      if (this.isSelect) {
        // 训练模式的样式
        return {
          correct: this.parsingFlag,
          error: this.isError
        };
      }
      // 选项样式 (不是刷题的)
      return {
        error: this.isError,
        correct: this.parsingFlag
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
.options {
  position: relative;
  display: flex;
  align-items: center;
  width: 596px;
  min-height: 54px;
  padding: 10px 18px 10px 66px;
  background: #F7F8F9;
  border-radius: 6px 6px 6px 6px;

  .round {
    position: absolute;
    top: 50%;
    left: 16px;
    transform: translateY(-50%);
    width: 34px;
    height: 34px;
    border-radius: 25px;
    border: 1px solid #E5E6EB;
    font-size: 20px;
    font-family: PingFang SC-Heavy, PingFang SC;
    font-weight: 800;
    color: #333333;
  }

  .option-text {
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    color: #6A7487;
  }

  .img {
    position: absolute;
    left: 0;
    top: 0;
  }

  .error-icon {
    z-index: 3;
  }

  .icon {
    position: absolute;
    top: 10px;
    left: 16px;
    z-index: 2;
    width: 34px;
    height: 34px;
  }
}

.correct {
  background: #DBFFF3 !important;
}

.error {
  background: #FEE8E8;
}

.active {
  background: #FFF2E9;
}

.round-active {
  background: linear-gradient(180deg, #FFBA4E 0%, #FB771A 100%);
  color: #fff !important;
}

.hand {
  cursor: pointer;

  &:hover {
    background: #FFFAF6;
  }
}
</style>
