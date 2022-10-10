<!--
 * @Author: lpj 1248708823@qq.com
 * @Date: 2022-06-14 11:19:05
 * @LastEditors: lpj 1248708823@qq.com
 * @LastEditTime: 2022-06-23 14:44:50
 * @Description: 测试基础容器 【注意】这边和成长课共用 修改需谨慎
-->
<template>
  <div class="wrapper">
    <div v-if="!isGrowth" class="m-b-24">
      <header-wapper  :current="current"></header-wapper>
    </div>
    <div v-if="!loading">
<!--      <test-result v-if="isCheck" :scoreInfo="scoreInfo" :isGrowth="isGrowth"></test-result>-->
      <hoc-score v-if="isCheck" :scoreInfo="scoreInfo" :isGrowth="isGrowth"></hoc-score>
      <test-status-card v-else :examInfo="examInfo" :isGrowth="isGrowth"></test-status-card>
    </div>
  </div>
</template>

<script>
import TACAPI from '@/api/TAC.API'
import TestResult from './test-result.vue'
import TestStatusCard from './test-status-card'
import { timestampFormat, timeToDay } from '@u/filters/index.js'
import { ACTIVITY_CHECK } from '@_c/check-api.js'
import { CONFIRM_TO_HOME } from '@_c/page';
import { createNamespacedHelpers, mapGetters } from 'vuex';
const { mapMutations } = createNamespacedHelpers('growthDetail');
import HeaderWapper from '../activity-header.vue';


import {config,hoc,baseView} from "@/components/base-view/exam-classtest-score/index.js"

const HocScore = hoc(baseView,{
  props: {
    key: 'scoreInfo',
    columns: config.testResultColumns,
  },
  events: {
    initData(){
      this.scoreInfo=Object.assign(this.scoreInfo,{
        title:'恭喜您完成考试',
        tip:'快来看您的成绩~',
        btnText:'查看试题分析',
      })
      return this.formatData()
    },
    formatData(){
      return {
        ...this.scoreInfo,
        name:this.scoreInfo.testName,
        score:this.scoreInfo.stuScore,
      }
    },
    toAnalysis() {
      const testPaperId = this.$route.query.dataId
      const query = this.isGrowth ? {
        type: 'growth',
        growthId: this.$route.query.growthId,
        courseId: this.$route.query.courseId,
        chapterId: this.$route.query.chapterId,
        chapterDetailId: this.$route.query.chapterDetailId,
        dataId: this.$route.query.dataId
      } : {
        type: 'class',
        classId: this.$route.query.classId,
        courseId: this.$route.query.courseId,
        chapterId: this.$route.query.chapterId,
        chapterDetailId: this.$route.query.chapterDetailId,
        dataId: this.$route.query.dataId
      }
      const { href } = this.$router.resolve({
        path: `/test/student/${testPaperId}/result-detail`,
        query
      })
      window.open(href, '_blank');
    }
  }
})

export default {
  props:['current'],
  components: {
    TestResult,
    TestStatusCard,
    HeaderWapper,
    HocScore,
  },
  data () {
    return {
      // 测试id
      testPaperId: '',
      // 测试试卷信息 https://yapi.goktech.cn/project/391/interface/api/35890
      scoreInfo: {
        // 除了上面的额外增加
        // 用时格式化
        spentTimeFormat: '',
        // 交卷时间格式化
        submitTimeFormat: ''
      },
      // 模型信息 https://yapi.goktech.cn/project/391/interface/api/37593
      // 批改分数详情
      examInfo: {

      },
      // 批改
      isCheck: false,
      api: {
        getTestCount: '',
        getScoreInfo: ''
      },
      loading: false
    }
  },
  computed: {
    /**
     * @description: 判断是不是成长课
     * @return {Boolean }
     */
    isGrowth () {
      const routePath = this.$route.path;
      if (routePath.includes('growth-path-details')) {
        return true;
      }
      return false;
    }
  },
  async mounted () {
    this.testPaperId = this.$route.query.dataId
    this.loading = true
    // 校验权限
    ACTIVITY_CHECK('TEST', this.testPaperId, this.$route.query.growthId).then(res => {
      // const data = res.data;
      // this.resourcePermission = data;
    })
    this.initApi()
    // 先获取试卷详情
    await this.getTestCount()
    // 获取测试批改信息
    if (this.isCheck) { await this.getScoreInfo() }
    this.loading = false
  },
  methods: {
    // 设置题目数量，给header使用
    ...mapMutations(['setTopicNum']),
    initApi () {
      this.api.getTestCount = TACAPI.getTestCount(this.testPaperId, this.isGrowth)
      this.api.getScoreInfo = this.isGrowth ? TACAPI.getTestScoreGrowth(this.testPaperId) : TACAPI.getTestScore(this.testPaperId)
      // TODO
    },
    /**
     * @description: 获取测试批改信息
     * @return {*}
     */
    async  getScoreInfo () {
      let res
      try {
        res = await this.$one.uc.http.get(this.api.getScoreInfo, {})
        console.log(res.data);
        this.scoreInfo = res.data
        // 格式化数据
        this.formatData()
      } catch (error) {
        // 未批改
        console.error(error)
        if (error.response.data.code === 20103) {
          this.isUnCheck = true
          return
        }
        this.$Message.error(error?.response?.data?.message || error?.message)
      }
    },

    async getTestCount () {
      const res = await this.$one.uc.http.get(this.api.getTestCount, {})
      this.examInfo = res.data
      // 批改标记0未批1已批2未交
      this.isCheck = this.examInfo.isSubmit && this.examInfo.markFlag === 1
      this.setTopicNum(res.data.topicNum)
    },

    /**
   * @description: 格式化数据
   * @return {void}
   */
    formatData () {
      this.scoreInfo.spentTimeFormat = timeToDay(this.scoreInfo.spentTime)
      this.scoreInfo.submitTimeFormat = timestampFormat(this.scoreInfo.submitTime)
      this.scoreInfo.correctRate += '%'
      this.scoreInfo.scoreRete += '%'
    }
  }
}
</script>

<style lang="stylus" scoped>

</style>
