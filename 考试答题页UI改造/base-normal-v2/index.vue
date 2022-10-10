<template>
  <div>
    <button @click="switchPage(1)">改造前</button>
    <parsing-range :parsingData="parsingData" :routeObj="routeObj"></parsing-range>
<!--    <div class="examOrTest-wrap" v-if="topicsList.length">-->
<!--    &lt;!&ndash; 头部 &ndash;&gt;-->
<!--    <exam-header :examOrTestName="examName">-->
<!--      <Button type="primary" v-click-loading="{callback: () => submitExamFunc(), time: 0}">交卷</Button>-->
<!--    </exam-header>-->
<!--    <div class="left-section" ref="list">-->
<!--      &lt;!&ndash; 题目 &ndash;&gt;-->
<!--      <question-item v-for="(item, index) in topicsList" :key="item.examTopicId" :currentItem = item :currentIdx = index @save="saveLocalData" :examId="examId" :answerId="stuAnswerId" @refresh="refreshList"></question-item>-->
<!--    </div>-->
<!--    <div class="right-section">-->
<!--      &lt;!&ndash; 头部信息 &ndash;&gt;-->
<!--      <exam-info :hour="hours" :minute="minutes" :second="seconds" :stuInfo="stuInfo" :curCutNum="curCutNum" :curCutTime="curCutTime" :screenFlag="screenFlag"></exam-info>-->
<!--      &lt;!&ndash; 答题卡 &ndash;&gt;-->
<!--      <question-card @choose="jump" :topicsList="topicsList"></question-card>-->
<!--    </div>-->
<!--  </div>-->
<!--    &lt;!&ndash; 弹框 &ndash;&gt;-->
<!--    <customModal v-if="showPanel==='custom'" @ok="handleReturn" :modalTitle="modalTitle" :modalContent="modalContent"></customModal>-->
<!--    &lt;!&ndash; 未全部答完交卷的提示 &ndash;&gt;-->
<!--    <confirmModal v-if="showPanel==='confirm'" :confirmModalTitle="'还有未作答的题目，确认交卷吗？'" :confirmModalContent="'当前还有未作答的题目，您仍要交卷吗？'">-->
<!--      <Button type="text" @click="togglePanel()" :disabled="httpRequst">继续答题</Button>-->
<!--      <Button type="primary" v-click-loading="{callback: () => submitExamData(examSubmitType.MANUAL.value)}">交卷</Button>-->
<!--    </confirmModal>-->
  </div>
</template>

<script>
import customModal from '@c/examOrTest/student/modal.vue'
import confirmModal from '@c/examOrTest/student/confirm-modal.vue'
import screenfull from 'screenfull'
import examHeader from '@c/examOrTest/student/header.vue'
import questionItem from '@c/examOrTest/student/question-item.vue'
import questionCard from '@c/examOrTest/student/question-card.vue'
import examInfo from '@c/examOrTest/student/examOrTest-info.vue'
import TEST_TOPIC_TYPE from '@e/test-topic-type.js' // 题目类型枚举
import { forbidCopy, forbidPaste, releaseForbidCopy, releaseForbidPaste } from '@u/keyboard-mouse.js' // 键鼠相关函数
import { savePaperDataToLocal, getPaperDataToLocal, deletePaperDataToLocal, deleteOutOfDataPaperDataByMemberId } from '@u/paperdata-localstorage.js' // 存取本地数据
import EXAM_SUBMIT_TYPE from '@e/exam-submit-type.js' // 交卷方式枚举
import cloneDeep from 'lodash/cloneDeep';
import map from "lodash/map"
import parsingRange from "@c/base-view/exam-driving-range-parsing/index.vue";

export default {
  components: { examHeader, examInfo, questionCard, questionItem, customModal, confirmModal,parsingRange },
  data () {
    return {
      parsingData:{}, //组装数据，向子组件传
      routeObj: {
        type: this.$route.query.type || 0, // 练习类型（0: tab页面 1：错题 2：收藏页面） type
        practiceId: this.$route.query.practiceId || '', // 练习试卷id
        knowledgeId: this.$route.query.knowledgeId || '', // 知识点id
        typeChild: 1, // 练习类型1：普通 2：训练
        requireNum: '', // 需要答题数量
        tabName: this.$route.query.tabName || '', // tab页面名称
        stuPracticeId: '', // 学生答题卡id
        fm: this.$route.query.fm || '' // 班课来答题的或者看解析的
      },
      examSubmitType: EXAM_SUBMIT_TYPE, // 交卷方式枚举
      topicsConfig: {}, // 设置信息
      resList: [], // 接口请求回来的列表
      topicsList: [], // 测试题目列表
      titleType: TEST_TOPIC_TYPE, // 题目枚举
      isFullScreen: false, // 是否全屏
      errorExitTime: 0, // 退出页面的时间（后端拿最新请求接口的时间 - 最后一次保存数据的时间）
      curCutNum: 0, // 当前已切屏的次数
      curCutTime: 0, // 当前已切屏的时间
      cutStartTime: 0, // 切屏开始的时间
      cutEndTime: 0, // 切屏结束的时间
      thisTime: 0, // 本次切屏的时长
      settedCutNum: 0, // 系统设置的可切屏次数
      examName: '', // 考试名称
      stuAnswerId: '', // 学生答题卡id
      examId: '', // 考卷id
      hours: 0, // 倒计时的时
      minutes: 0, // 倒计时的分钟
      seconds: 0, // 倒计时的秒数
      promiseTimer: null, // 倒计时定时器
      submitWay: 0, // 提交方式：0-手动交卷；1-自动交卷；
      timeNumber: 0, // 计时，每1分钟触发一次接口保存
      stuInfo: {}, // 学生信息
      firstEnter: 1, // 是否第一次进入: 1是0否
      goBackFlag: 0, // 退回操作标志0:没有退回，1：退回
      showHandel: false, // 是否展示全屏、非全屏的提示（handleCut下的modal，因为请求列表中的方法中有各种情况的弹窗，onfouse和onblur会导致两处modal展示）
      isSubmit: false, // 是否交卷，交卷了就不提示切屏，不管还有没有切屏次数
      examEndTime: 0, // 考试结束的时间（有退回操作就是到退回的时间）
      screenFlag: 0, // 允许切屏： 1允许 0 不允许
      showPanel: '', // 组件展示类型
      modalTitle: '', // 弹框title
      modalContent: '', // 弹框content
      httpRequst: false, // 是否在请求交卷的接口
      countAddCurCutNumFlag: true, // 计算是否可以增加次数（防止Edge浏览器 Win+Tab 出现）
    }
  },
  watch: {
    timeNumber (newVal) {
      if (!this.isSubmit) { // 如果已交卷不再触发保存
        if (newVal % 60 === 0) { // 2021-6-23 需求：若异常离开后没有回来继续考试，考试时间到之后自动交卷，与产品确认改成1分钟提交一次记录，允许1分钟的数据误差
          // 每一分钟备份保存
          this.saveExamData()
        }
      }
    }
  },
  mounted () {
    const curMemberId = this.$one.uc.token.getCurTenant().memberId; // 当前登录的member
    const curTime = new Date().getTime()
    deleteOutOfDataPaperDataByMemberId('examData', curMemberId, curTime) // 删除当前用户的已结束的考试备份数据

    this.getExam() // 获取题目信息与设置

    const _this = this
    if (screenfull.isEnabled) {
      screenfull.on('change', () => { // 监听全屏变化
        if (_this.screenFlag && !_this.isSubmit) { // 设置了切屏限制未交卷才做处理
          _this.isFullScreen = screenfull.isFullscreen
          _this.changeFullscreenStatus(screenfull.isFullscreen)
        }
      });
    }
    // 监听用户切屏
    window.onblur = () => { // 失去焦点
      if (_this.screenFlag && !_this.isSubmit) { // // 设置了切屏限制未交卷才做处理
        _this.pageBlur()
      }
    }

    window.onfocus = () => { // 聚焦
      if (_this.screenFlag && !_this.isSubmit) { // // 设置了切屏限制未交卷才做处理
        _this.handleCut()
      }
    }

    window.onbeforeunload = function () {
      return false
    }

    if (document.hidden !== undefined) {
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) { // 页面被隐藏
          // console.log('页面隐藏', document.hidden)
          window.clearTimeout(_this.promiseTimer);
          _this.promiseTimer = null
          // console.log('还有定时器吗', _this.promiseTimer)
        } else { // 页面展示
          // console.log('页面展示', document.hidden)
          _this.getTimeAndStatus()
        }
      })
    }
  },
  // 离开时，清除定时器
  beforeDestroy () {
    if (this.isFullScreen) { // 如果全屏状态下
      screenfull.exit() // 退出全屏
    }
    window.clearTimeout(this.promiseTimer);
    this.promiseTimer = null
    window.onblur = () => {}
    window.onfocus = () => {}
    window.οnbefοreunlοad = () => {}
    if (this.screenFlag) { // 有全屏监听才解绑事件
      screenfull.off('change', this.changeFullscreenStatus);
    }
  },
  methods: {
    // 获取剩余时间和提交状态
    getTimeAndStatus () {
      this.$one.uc.http.get(this.$API.TAC.getExamSurplusTimeAndSubmitStatus(this.stuAnswerId), {}).then(res => {
        if (res.data.submitStatus) { // 已提交
          this.isSubmit = true // 已交卷
          this.hours = 0
          this.minutes = 0
          this.seconds = 0
          this.modalTitle = '交卷成功'
          this.modalContent = '试卷已提交，请等待老师批阅'
          this.togglePanel('custom') // 展示弹框
        } else { // 未提交
          this.countTime(res.data.timeLimit) // 新的剩余时间开启倒计时
        }
      })
    },

    // 切屏
    cutTime () {
      this.curCutTime = Number(this.curCutTime) + Number(this.thisTime) // 传给子组件展示
      this.saveCutInfo() // 保存到接口
      this.thisTime = 0 // 置0
    },

    // 多选题时强制刷新页面
    refreshList (Index, curTopic) {
      const curTopicz = JSON.parse(curTopic)
      this.topicsList.splice(Index, 1, curTopicz)
    },

    // 提交切屏信息
    saveCutInfo () {
      const params = {
        answerId: this.stuAnswerId,
        screenLimit: this.curCutNum,
        screenTime: this.thisTime
      }
      // console.log('提交切屏信息 params=>', params)
      this.$one.uc.http.post(this.$API.TAC.saveCutScreenInfo, { data: params }).then(res => {
        // console.log('提交切屏信息 res=>', res)
      })
    },

    // 本地存答案
    saveLocalData () {
      if (this.examEndTime) { // 需要存结束时间：第一次存这份卷子时
        savePaperDataToLocal('examData', this.examId, this.topicsList, this.examEndTime)
      } else {
        savePaperDataToLocal('examData', this.examId, this.topicsList)
      }
    },

    // 获取考试题目列表、设置信息、学生考试信息等
    getExam () {
      this.$one.uc.http.get(this.$API.TAC.studentGetExamDetail(this.$route.params.examId), {}).then(res => {
        const topicsConfig = res.data.examActivityDetailRes // 设置信息
        this.topicsConfig = res.data.examActivityDetailRes // 设置信息
        this.examId = topicsConfig.id // 考试卷id
        this.examName = topicsConfig.name // 考试名称
        this.stuAnswerId = res.data.stuAnswerId // 答题卡Id
        // 头像、学生名称
        this.stuInfo.avatar = res.data.avatar
        this.stuInfo.userName = res.data.userName
        this.resList = res.data.examTopicListResList
        this.curCutNum = res.data.stuScreenLimit // 已切屏次数
        this.curCutTime = Number(res.data.stuScreenTime) // 已切屏时长
        this.settedCutNum = topicsConfig.screenLimit // 设置的可切屏的次数
        this.firstEnter = res.data.firstLimit // 是否为第一次进入详情页面 0-不是 ，1-是
        this.screenFlag = topicsConfig.screenFlag // 是否允许切屏
        this.goBackFlag = topicsConfig.goBackFlag // 退回操作标志0:没有退回，1：退回
        this.errorExitTime = Number(res.data.errorExitTime) // 退出页面的时间（后端拿最新请求接口的时间 - 最后一次保存数据的时间）
        const list= this.formatData(res.data.examTopicListResList)
        this.parsingData={
          titleName:topicsConfig.name,
          ...topicsConfig,
          list,
        }
        this.routeObj.requireNum=list.length

        if (this.firstEnter) { // 第一次进来
          this.examEndTime = new Date().getTime() + Number(this.topicsConfig.remainingTime)
        }
        if (this.goBackFlag) { // 退回的操作:已经交卷过了，没有之前的数据，需从接口拿，需重新存这份卷子
          this.examEndTime = new Date().getTime() + Number(this.topicsConfig.goBackRemainingTime)
        }

        if (this.goBackFlag) { // 退回
          if (this.screenFlag) { // 设置了可切屏
            if (this.curCutNum >= (this.settedCutNum + 1)) { // 之前的切屏次数已超过限制
              if (this.firstEnter) { // 被退回后，第一次进来这个字段也会是1
                const _self = this
                _self.$Modal.info({
                  title: '温馨提示',
                  content: `当前考试已被延长${_self.topicsConfig.goBackTime / 60000}分钟，您可以继续作答。您之前的切屏次数已超过限制，继续考试后不可再次切屏，否则系统将自动交卷，请认真答题！`,
                  okText: '继续考试',
                  onOk: () => {
                    _self.pageRender(_self.firstEnter, _self.resList)
                    _self.countTime(_self.topicsConfig.goBackRemainingTime) // 后端给的剩余考试时间
                    screenfull.request()
                  }
                });
              } else {
                this.pageRender(this.firstEnter, this.resList, true)
                this.countTime(this.topicsConfig.remainingTime) // 后端给的剩余测试时间
                this.curCutNum++
                if (this.errorExitTime) { // 异常退出时长, 后端给: 请求本接口的时间-一分钟存数据接口的时间
                  this.thisTime = this.errorExitTime
                } else {
                  this.thisTime = 0
                }
                this.cutTime()
              }
            }
            if (this.curCutNum < (this.settedCutNum + 1)) { // 之前的切屏次数未超过限制
              const _self = this
              _self.$Modal.info({
                title: '温馨提示',
                content: `当前考试已被延长${_self.topicsConfig.goBackTime / 60000}分钟，您可以继续作答。您之前已经切换离开考试页面${_self.curCutNum}，若超过${_self.settedCutNum}次，系统将自动交卷，请认真答题！`,
                okText: '继续考试',
                onOk: () => {
                  _self.pageRender(_self.firstEnter, _self.resList)
                  _self.countTime(_self.topicsConfig.goBackRemainingTime) // 后端给的剩余考试时间
                  screenfull.request()
                }
              });
            }
          } else { // 不可切屏
            const _self = this
            _self.$Modal.info({
              title: '温馨提示',
              content: `当前考试已被延长${_self.topicsConfig.goBackTime / 60000}分钟，您可以继续作答。`,
              okText: '继续考试',
              onOk: () => {
                _self.pageRender(_self.firstEnter, _self.resList)
                _self.countTime(_self.topicsConfig.goBackRemainingTime) // 后端给的剩余考试时间
              }
            });
          }
        } else { // 没有退回操作
          if (this.screenFlag) { // 有设置切屏次数
            if (this.firstEnter) { // 第一次进来考试
              const _self = this
              _self.$Modal.info({
                title: '温馨提示',
                content: `当前考试过程中不允许切换离开考试页面超过${_self.settedCutNum}次，否则将自动交卷，请认真答题！`,
                okText: '知道了',
                onOk: () => { // 全屏、倒计时
                  _self.pageRender(_self.firstEnter, _self.resList)
                  _self.countTime(_self.topicsConfig.remainingTime) // 后端给的剩余考试时间
                  screenfull.request();
                }
              })
            } else { // 非第一次进来
              if (!this.settedCutNum) { // 设置可切屏次数为0,不是第一次进来，说明之前切屏过了，直接交卷
                this.pageRender(this.firstEnter, this.resList, true)
                this.countTime(this.topicsConfig.remainingTime) // 后端给的剩余考试时间
                this.curCutNum = 1
                if (this.errorExitTime) { // 异常退出时长, 后端给: 请求本接口的时间-一分钟存数据接口的时间
                  this.thisTime = this.errorExitTime
                } else {
                  this.thisTime = 0
                }
                this.cutTime()
              } else { // 设置可切屏次数大于0
                if (this.curCutNum <= this.settedCutNum) { // 切屏次数未超过限制的情况下
                  this.curCutNum++ // 上次考试过程异常离开，视为切屏1次
                  if (this.errorExitTime) { // 异常退出时长, 后端给: 请求本接口的时间-一分钟存数据接口的时间
                    this.thisTime = this.errorExitTime
                  } else {
										this.thisTime = 0
									}
                  this.cutTime()
                  if (this.curCutNum >= (this.settedCutNum + 1)) { // 提交
                    this.pageRender(this.firstEnter, this.resList, true)
                    this.countTime(this.topicsConfig.remainingTime) // 后端给的剩余测试时间
                  } else {
                    const _self = this
                    _self.$Modal.warning({
                      title: '警告',
                      content: `上次考试过程异常离开，视为切屏1次，您已经切换离开考试页面${_self.curCutNum}次，若超过${_self.settedCutNum}次，系统将自动交卷，请认真答题！`,
                      okText: '继续考试',
                      onOk: () => { // 全屏处理
                        _self.pageRender(_self.firstEnter, _self.resList)
                        _self.countTime(_self.topicsConfig.remainingTime) // 后端给的剩余考试时间
                        screenfull.request()
                      }
                    });
                  }
                } else { // 切屏次数超过限制的情况下
                  this.pageRender(this.firstEnter, this.resList, true)
                  this.countTime(this.topicsConfig.remainingTime) // 后端给的剩余测试时间
                  this.curCutNum++
                  if (this.errorExitTime) { // 异常退出时长, 后端给: 请求本接口的时间-一分钟存数据接口的时间
                    this.thisTime = this.errorExitTime
                  } else {
                    this.thisTime = 0
                  }
                  this.cutTime()
                }
              }
            }
          } else { // 没有设置可切屏次数
            this.pageRender(this.firstEnter, this.resList)
            this.countTime(this.topicsConfig.remainingTime) // 后端给的剩余考试时间
          }

          // 禁止复制【0 - 禁止 / 1 - 不禁止】
          topicsConfig.copyTopic ? releaseForbidCopy() : forbidCopy();
          // 禁止黏贴【0 - 禁止 / 1 - 不禁止】
          topicsConfig.pasteAnswer ? releaseForbidPaste() : forbidPaste();
          this.$once('hook:beforeDestroy', () => {
            releaseForbidCopy();
            releaseForbidPaste();
          })

        }
      }).catch(err => {
        // console.log(err.response.data)
        if (err.response.data.code === 20610) { // 已交卷
          this.modalTitle = '提示'
          this.modalContent = err.response.data.message
          this.togglePanel('custom') // 展示弹框
        }
      })
    },

    pageRender (firstLimit, examTopicListResList, force) { // 页面数据渲染
      if (this.goBackFlag) { // 被退回的, 展示接口的答题记录
        this.getPaperData()
      } else {
        if (firstLimit) { // 说明第一次进来考试: 是否为第一次进入详情页面 0-不是 ，1-是
          const topicsList = examTopicListResList
          for (let i = 0; i < topicsList.length; i++) {
            if (topicsList[i].type === this.titleType.MULTI.value) { // 如果多选题，增加checkedList，绑定
              if (topicsList[i].stuAnswer) { // 退回得操作如果多选有答案时
                topicsList[i].checkedList = topicsList[i].stuAnswer.split(',')
              } else {
                topicsList[i].checkedList = []
              }
            }
          }
          this.topicsList = topicsList
          this.saveLocalData() // 第一次进来后要把题目存一下，不然如果还未1分钟，未保存数据，再次进来获取不了任何的数据（本地没有，接口也没有）
          this.saveExamData() // 进入页面保存一次数据，解决errorExitTime越加越大（后端数据差异）
        } else { // 中断考试后再进来的：先取本地的缓存，如果没有缓存，接口取数据
          const tempList = getPaperDataToLocal('examData', this.examId)
          if (tempList && tempList.length) {
            this.topicsList = tempList
            this.saveExamData()
          } else {
            this.getPaperData()
          }
        }
      }

      if (force) {
        setTimeout(() => {
          this.$Modal.warning({
            title: '交卷中…',
            content: `您已经切换离开考试页面超过${this.settedCutNum}次，系统自动交卷中…`
          });
          this.submitExamData(this.examSubmitType.SCREEN.value)
        }, 500)
      }
    },

    // 获取接口的考试记录
    getPaperData () {
      this.$one.uc.http.get(this.$API.TAC.getPaperData(this.examId, this.stuAnswerId), {}).then(res => {
        if (res.data.length) { // 查得到记录
          const portTopicsList = res.data
          for (let i = 0; i < portTopicsList.length; i++) {
            if (portTopicsList[i].type === this.titleType.MULTI.value) { // 如果多选题，增加checkedList，绑定
              portTopicsList[i].checkedList = portTopicsList[i].stuAnswer.split(',')
            }
          }
          this.topicsList = portTopicsList
          this.saveExamData()
        } else { // 查不到记录, 拿进入详情的接口的列表展示
          const portTopicsList = this.resList
          for (let i = 0; i < portTopicsList.length; i++) {
            if (portTopicsList[i].type === this.titleType.MULTI.value) { // 如果多选题，增加checkedList，绑定
              portTopicsList[i].checkedList = portTopicsList[i].stuAnswer.split(',')
            }
          }
          this.topicsList = portTopicsList
          this.saveExamData()
        }
      })
    },

    // 倒计时
    countTime (sDate) {
      var that = this;
      let countDownNum = sDate;
      if (countDownNum <= 0) return;
      that.getCountdownString(countDownNum);
      const interval = 1000
      const start = new Date().getTime()
      let count = 0;
      window.clearTimeout(that.promiseTimer);
      that.promiseTimer = window.setTimeout(countDownStart, interval);
      function countDownStart () {
        var offset, nextTime; // offset是倒计时误差时间，nextTime是减去误差时间后下一次执行的时间
        count++;
        that.timeNumber++;
        offset = new Date().getTime() - (start + count * interval);
        nextTime = interval - offset;
        if (nextTime < 0) { nextTime = 0; }
        countDownNum -= interval;
        that.getCountdownString(countDownNum);
        // console.log('误差: ' + offset + 'ms, 下一次执行: ' + nextTime + 'ms后，离考试结束还有: ' + countDownNum + 'ms');
        if (countDownNum <= 0) {
          window.clearTimeout(that.promiseTimer);
          that.promiseTimer = null
          // 时间到，自动交卷
          that.submitExamData(that.examSubmitType.AUTO.value)
        } else {
          window.clearTimeout(that.promiseTimer);
          that.promiseTimer = window.setTimeout(countDownStart, nextTime);
        }
      }
    },

    // 页面倒计时展示
    getCountdownString (countDowmNum) {
      if (countDowmNum <= 0) return
      this.hours = Math.floor((countDowmNum / 3600 / 1000) % 24)
      this.minutes = Math.floor((countDowmNum / 60 / 1000) % 60)
      this.seconds = Math.floor((countDowmNum / 1000) % 60)

      if (this.hours === 0) {
        if (this.minutes !== 0 && this.seconds === 0) {
          this.seconds = 59
          this.minutes -= 1
        } else if (this.minutes === 0 && this.seconds === 0) {
          this.seconds = 0
        } else {
          this.seconds -= 1
        }
      } else {
        if (this.minutes !== 0 && this.seconds === 0) {
          this.seconds = 59
          this.minutes -= 1
        } else if (this.minutes === 0 && this.seconds === 0) {
          this.hours -= 1
          this.minutes = 59
          this.seconds = 59
        } else {
          this.seconds -= 1
        }
      }
    },

    // 定位答题卡的题目
    jump (index) {
      const height = 80 // 头部的高72px再加一点点
      const list = this.$refs.list
      // 获取需要滚动的距离
      const total = list.childNodes[index].offsetTop - height;
      document.documentElement.scrollTop = total
    },

    // 在全屏状态改变时触发
    changeFullscreenStatus (isFullscreen) {
      // console.log('changeFullscreenStatus-----在全屏状态改变时触发')
      this.showHandel = true // 标记可以提示handleCut中的
      if (!isFullscreen) {
        this.cutStartTime = new Date().getTime() // 切屏开始的时间
        if(this.countAddCurCutNumFlag){
          this.curCutNum++
          this.countAddCurCutNumFlag = false
          setTimeout(()=>{
            this.countAddCurCutNumFlag = true
          },3000)
        }
        this.handleCut()
      }
    },

    // 页面失去焦点
    pageBlur () {
      // console.log('pageBlur-----页面失去焦点')
      document.title = '请继续考试';
      this.cutStartTime = new Date().getTime() // 切屏开始的时间
      if(this.countAddCurCutNumFlag){
        this.curCutNum++
        this.countAddCurCutNumFlag = false
        setTimeout(()=>{
          this.countAddCurCutNumFlag = true
        },3000)
      }
    },

    // 切屏的处理
    handleCut () {
      // console.log('切屏了....')
      if (this.isSubmit) { // 交卷
        return
      }
      if (this.showHandel) { // 本页面的切屏提醒，排除进入页面时多种情况的提醒
        if (!this.settedCutNum) { // 设置可切屏次数为0,现在切一次，直接交卷
          this.thisTime = 0 // 切屏的时长为0，因为切一下就提交了
          this.curCutNum = 1
          this.cutTime()
          this.$Modal.warning({
            title: '交卷中…',
            content: `您已经切换离开考试页面超过${this.settedCutNum}次，系统自动交卷中…`
          });
          this.submitExamData(this.examSubmitType.SCREEN.value)
        } else { // 设置可切屏次数大于0
          // console.log('设置可切屏次数大于0')
          if (this.curCutNum > (this.settedCutNum + 1) && !this.goBackFlag) { // 如果达到切屏次数+1，自动交卷，交卷完成后会关闭全屏，达到此条件，return出去
            this.submitExamData(this.examSubmitType.SCREEN.value)
            return
          }
          // console.log('this.curCutNum---',this.curCutNum)
          // console.log('this.settedCutNum---',this.settedCutNum)
          document.title = '正在考试中,请勿离开';
          if (this.curCutNum && this.curCutNum < (this.settedCutNum + 1)) { // 未达到限制次数
            this.$Modal.warning({
              title: '警告',
              content: `您已经切换离开考试页面${this.curCutNum}次，若超过${this.settedCutNum}次，系统将自动交卷，请认真答题！`,
              okText: '知道了',
              onOk: () => { // 全屏处理
                this.cutEndTime = new Date().getTime() // 切屏结束的时间
                this.thisTime = this.cutEndTime - this.cutStartTime // 切屏的时长
                this.cutTime()
                if (!this.isFullScreen) { // 如果非全屏状态下
                  screenfull.request(); // 全屏
                }
              }
            });
          }

          if (this.curCutNum >= (this.settedCutNum + 1)) { // 达到限制次数
            // console.log('限制次数已达到')
            this.cutEndTime = new Date().getTime() // 切屏结束的时间
            this.thisTime = this.cutEndTime - this.cutStartTime // 切屏的时长
            this.cutTime()
            this.$Modal.warning({
              title: '交卷中…',
              content: `您已经切换离开考试页面超过${this.settedCutNum}次，系统自动交卷中…`
            });
            this.submitExamData(this.examSubmitType.SCREEN.value)
          }
        }
      }
    },

    // 点击‘交卷’
    submitExamFunc () {
      const noAll = this.topicsList.some(item => {
        if (item.type === this.titleType.ANSWER.value || item.type === this.titleType.FILL.value) { // 主观题
          let curAnswer = item.stuAnswer // 不改变stuAnswer值
          curAnswer = curAnswer.replace(/<p>|<\/p>/gi, ''); // 过滤<p></p>
          curAnswer = curAnswer.replace(/<br>/gi, ''); // 过滤<br>
          return !curAnswer
        } else if (item.type === this.titleType.MULTI.value) {
          return item.checkedList && !item.checkedList.length
        } else {
          return !item.stuAnswer
        }
      })

      return new Promise((r, j) => {
        if (noAll) { // 有没做的题目
          this.togglePanel('confirm').then(res => { j() }).catch(() => j())
        } else { // 题目都做完了
          this.submitExamData(this.examSubmitType.MANUAL.value).then(res => { r() }).catch(err => { j() })
        }
      })
    },

    // 交卷接口
    submitExamData (way) {
      this.httpRequst = true
      this.submitWay = way // 提交方式：0-手动交卷；1-自动交卷；2-切屏到达限制提交
      // 处理入参
      const answers = this.handleSubmitData(this.topicsList)
      const data = {
        examId: this.examId,
        submitWay: this.submitWay,
        stuAnswerId: this.stuAnswerId,
        answers
      }

      return this.$one.uc.http.post(this.$API.TAC.submitExam, { data }).then(res => {
        this.httpRequst = false
        this.$Modal.remove()
        this.isSubmit = true // 已交卷
        this.modalTitle = '交卷成功'
        this.modalContent = '试卷已提交，请等待老师批阅'
        this.togglePanel('custom') // 展示弹框
        window.clearTimeout(this.promiseTimer);
        this.promiseTimer = null
        screenfull.exit() // 关闭全屏
        deletePaperDataToLocal('examData', this.examId) // 删除记录
      }).catch(err => {
        this.httpRequst = false
        // console.log(err.response.data)
        if (err.response.data.code === 20610) { // 已交卷
          this.modalTitle = '提示'
          this.modalContent = err.response.data.message
          this.togglePanel('custom') // 展示弹框
        }
      })
    },

    // 返回列表页
    handleReturn () {
      this.togglePanel()
      // this.$router.push({
      //   path: '/exam-center/own'
      // })
      this.$router.push({
        path: '/exam',
        query: { t: 1 }
      })
    },

    // 切换弹框
    togglePanel (val = '') {
      return new Promise((r, j) => {
        this.showPanel = val
        r()
      })
    },

    // 处理上传的数据
    handleSubmitData (handleList) {
      const answers = []
      const totalTopicList = handleList
      for (let i = 0; i < totalTopicList.length; i++) {
        let newAnswer = []
        if (totalTopicList[i].type === this.titleType.MULTI.value) { // 多选题
          const checkChoseList = totalTopicList[i].checkedList.filter(item => { return item }) // 过滤掉''
          if (checkChoseList.length) {
            newAnswer = totalTopicList[i].checkedList
          }
        } else {
          if (totalTopicList[i].stuAnswer) {
            newAnswer.push(totalTopicList[i].stuAnswer)
          }
        }
        answers.push({ examTopicId: totalTopicList[i].examTopicId, stuAnswer: newAnswer })
      }
      return answers
    },

    // 每一分钟提交一次考试数据
    saveExamData () {
      // 处理入参
      const answers = this.handleSubmitData(this.topicsList)
      const data = {
        examId: this.examId,
        stuAnswerId: this.stuAnswerId,
        answers
      }
      this.$one.uc.http.post(this.$API.TAC.savePaperData, { data }).then(res => {

      }).catch(err => {
        // console.log(err.response.data)
        if (err.response.data.code === 20610) { // 已交卷
          this.modalTitle = '提示'
          this.modalContent = err.response.data.message
          this.togglePanel('custom') // 展示弹框
        }
      })
    },

    // 格式化数据源，此是为调用视图组件传参，parsingRange.vue，
    // 因为学生班课测试大概也会用到，目前还没看到产品说要把学生班课的也改，为什么直接跳转，原先的练习场包含了太多不相干逻辑不pure
    formatData(params){
      function lay1(pitem) {
        const item= cloneDeep(pitem)
        // delete item.examTopicId
        return {
          id: pitem.examTopicId,
          ...item,
          options: map(pitem.options, lay2)
        }
      }

      function lay2(citem) {
        const item= cloneDeep(citem)
        // delete item.optionId
        return {
          id: citem.optionId,
          ...item,
        }
      }

      return map(params, lay1)
    },

    switchPage(num){
      switch (num) {
        case 1:
          this.$router.push(`/exam/student/before/${this.$route.params.examId}`)
          break;
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .examOrTest-wrap{
    padding: 104px 0 60px;
    width: 1100px;
    margin: 0 auto;
    display: flex;
    .left-section{
      width: 790px;
      background: #FFFFFF;
      box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.26);
    }
    .right-section{
      position: fixed;
      margin-left: 820px;
    }
  }
</style>
