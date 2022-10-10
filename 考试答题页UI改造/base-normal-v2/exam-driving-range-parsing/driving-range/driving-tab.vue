<template>
  <ul class="flex">
    <!-- 先选5个展示 -->
    <li
      v-for="(item, index) in tabNameList.slice(0, 5)"
      :key="index"
      :class="index === tabIndex && 'active'"
      @click="tabChange(index)"
    >
      {{ item.tabName }}
    </li>
    <!-- 当正好6个tab时，直接展示，不显示更多 -->
    <li
      v-if="tabNameList.length === 6"
      :class="tabIndex === 5 && 'active'"
      @click="tabChange(5)"
    >
      {{ tabNameList[5].tabName }}
    </li>
    <!-- 当超过6个时 -->
    <!-- <li
      v-if="currentTabName"
      :class="tabIndex >= 5 && 'active'"
      class="six"
      @click="tabChange(indexCard)"
    >
      {{ currentTabName }}
    </li> -->
    <li v-if="tabNameList.length > 6" :class="tabIndex >= 5 && 'active'">
      <Dropdown
        trigger="click"
        @on-visible-change="visibleChange"
        @on-click="currentState"
      >
        <!-- <a href="javascript:void(0)"> -->
        <span>{{ currentTabName || "更多" }}</span>
        <!-- <span>{{ currentTabName ? "" : "更多" }}</span> -->
        <!-- <span>更多</span> -->
        <Icon type="ios-arrow-down" :class="flag && 'rotate'"></Icon>
        <!-- </a> -->
        <DropdownMenu slot="list">
          <DropdownItem
            v-for="(item, index) in tabNameList.slice(5)"
            :key="index"
            @click.native="tabChangeCard(index + 5)"
            :name="item.tabName"
            :class="index + 5 === indexCard && 'active'"
            >{{ item.tabName }}</DropdownItem
          >
        </DropdownMenu>
      </Dropdown>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    // 当前高亮的tab索引
    tabIndex: {
      type: Number,
      required: true
    },

    // tab数据
    tabNameList: {
      type: Array,
      required: true
    }
  },

  data () {
    return {
      // 点击tab的tab名称
      currentTabName: '',
      indexCard: null,
      // 下拉状态
      flag: false
    };
  },

  methods: {
    // 点击tab
    tabChange (index) {
      this.$emit('tabChange', index);
    },
    // 点击tab
    tabChangeCard (index) {
      this.indexCard = index;
      this.$emit('tabChange', index);
    },

    // 点击tab的tab名称（tab超过6个）
    currentState (name) {
      this.currentTabName = name;
    },

    // 下拉状态被改变
    visibleChange (flag) {
      this.flag = flag;
    }
  }
};
</script>

<style lang="stylus" scoped>
ul {
  justify-content: flex-start;
  flex-wrap: wrap;

  li {
    padding: 4px 16px;
    border-radius: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 24px;
    font-size: 16px;
    font-family: Source Han Sans CN-Medium, Source Han Sans CN;
    font-weight: 500;
    color: #6A7487;
  }

  .active {
    background: #FE8836;
    color: #fff;
  }

  .six {
    padding-right: 25px;
  }
}

/deep/ .ivu-select-dropdown {
  left: 470px !important;
  width: 568px;
  height: 360px;
  padding: 24px 16px;
  box-shadow: 0px 16px 24px 1px rgba(0, 0, 0, 0.16);
  overflow: auto;

  ul {
    display: flex;

    li {
      padding: 4px 16px;
      border-radius: 1000px;
      margin-right: 16px;
      margin-bottom: 32px;

      &:hover {
        background: rgba(254, 136, 54, 0.1);
        color: #000;
      }
    }
  }
}

.more {
  margin-left: -51px;
  color: #fff;
}

/deep/ .ivu-dropdown {
  cursor: pointer;

  i {
    // 旋转
    transform: rotate(-90deg);
    margin-left: 10px;
    transition: all 0.3s ease-in-out;
  }

  .rotate {
    transform: rotate(0);
  }
}
</style>
