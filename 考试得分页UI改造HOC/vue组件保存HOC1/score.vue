<template>
  <div class="wrap">
    <gok-back-icon />
    <hoc-score v-if="loading" :show="info.showCheckDetailBtn" :info="info" :from="'exam'"></hoc-score>
<!--    <score :info="info" :from="'exam'"></score>-->
  </div>
</template>

<script>
import score from '@c/examOrTest/student/examOrTest-score.vue'
import {config,hoc,baseView} from "@/components/base-view/exam-classtest-score/index.js"
import { timestampFormat, timeToDay } from '@u/filters';
import cloneDeep from "lodash/cloneDeep"
import { STUDENT_FINISH_TEST_DETAIL } from '@_c/page.js' // 路由跳转文件

const HocScore = hoc(baseView,{
  props: {
    key: 'info',
    columns: config.examOrTestColumns,
  },
  events: {
    initData(){
      this.info=Object.assign(this.info,{
        title:'恭喜您完成考试',
        tip:'快来看您的成绩~',
        btnText:'查看试题分析',
      })
      return this.formatData()
    },
    /**
     * @description: 格式化数据
     * @return {void}
     * 交卷时间格式化以及用时格式化以及百分比
     */
    formatData () {
      const info =cloneDeep(this.info)
      info.spentTime = timeToDay(info.spentTime)
      info.submitTime = timestampFormat(info.submitTime)
      info.correctRate += '%'
      info.scoreRete += '%'

      return info
    },
    toAnalysis() {
      if (this.from === 'exam') {
        this.$router.push({
          path: `/exam/student/${this.$route.params.examId}/result-detail`
        });
      } else if (this.from === 'test') {
        STUDENT_FINISH_TEST_DETAIL(this.$route.params.testId)
      }
    }
  }
})
export default {
  components: {
    score,
    'hoc-score': HocScore,
  },
  data () {
    return {
      info: {}, // 考试得分信息
      loading:false,
    }
  },
  mounted () {
    // console.log(this.$route.params.examId)
    this.getStuExamScore()
  },
  methods: {
    // 获取分数信息
    getStuExamScore () {
      this.$one.uc.http.get(this.$API.TAC.getExamScore(this.$route.params.examId), { }).then(res => { // 接口
        // console.log(res)
        this.info.userName = res.data.userName
        this.info.submitTime = res.data.examActivityStuAnswerRes.submitTime
        this.info.score = res.data.examActivityStuAnswerRes.score
        this.info.name = res.data.examActivityStuAnswerRes.name
        this.info.correctRate = res.data.examActivityStuAnswerRes.correctRate
        this.info.scoreRete = res.data.examActivityStuAnswerRes.scoreRete
        this.info.spentTime = res.data.examActivityStuAnswerRes.spentTime
        this.info.showCheckDetailBtn = res.data.viewLimit // 1可查看，0不可
        this.loading=true
      })
    },
  }
}
</script>
<style lang="stylus" scoped>
.wrap{
  padding: 62px 0;
}
</style>
