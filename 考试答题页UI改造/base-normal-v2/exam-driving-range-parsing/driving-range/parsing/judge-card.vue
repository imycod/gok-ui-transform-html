<template>
  <div class="judge m-b-24" :class="style">
    <div class="option-text">{{ judge.label }}</div>
    <div>
      <!-- 错误的图片 -->
      <img
        v-if="isError"
        class="icon"
        src="~@img/driving-range/parsing/error-icon.png"
        alt=""
      />

      <!-- 正确的图片 -->
      <img
        v-if="judgeFlag"
        class="icon"
        src="~@img/driving-range/parsing/correct-icon.png"
        alt=""
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    judge: {
      type: Object,
      required: true
    },

    item: {
      // 题目描述
      type: Object,
      required: true
    },

    requireNum: {
      // 答题数量（用于判断是否展示答案）
      type: String,
      required: true
    },

    currentIndex: {
      // 索引
      type: Boolean,
      required: true
    }
  },

  computed: {
    // 用户答对了
    judgeFlag () {
      if (this.isSelect) {
        return this.parsingFlag && this.parsingFlagId;
      }
      return this.item.answer === this.item.stuAnswer && this.item.stuAnswer === this.judge.value;
    },

    // 是正确的选项
    parsingFlag () {
      return this.item.answer === this.judge.value;
      // return this.item.answer === this.item.stuAnswer && (this.item.answer === this.judge.value);
    },

    // 当前选项在答案数组中
    parsingFlagId () {
      return this.isCurrect.selectId.includes(this.judge.value);
    },

    // 用户是否答题错误
    isError () {
      if (this.isSelect) {
        return !this.isCurrect.flag && this.parsingFlagId;
      }
      return (
        this.item.answer !== this.item.stuAnswer &&
        this.item.stuAnswer === this.judge.value
      );
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
      return {
        error: !this.requireNum && this.isError,
        correct: !this.requireNum && this.parsingFlag
      };
    }
  }
};
</script>

<style lang="stylus" scoped>
.judge {
  position: relative;
  display: flex;
  align-items: center;
  width: 596px;
  min-height: 54px;
  padding: 10px 18px 10px 66px;
  background: #F7F8F9;
  border-radius: 6px 6px 6px 6px;

  .option-text {
    font-family: Source Han Sans CN-Regular, Source Han Sans CN;
    color: #6A7487;
  }

  .img {
    position: absolute;
    left: 0;
    top: 0;
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
  background: #DBFFF3;
}

.error {
  background: #FEE8E8;
}

.hand {
  cursor: pointer;

  &:hover {
    background: #FFFAF6;
  }
}

.active {
  background: #FFF2E9;
}
</style>
