<template>
  <div class="wrapper">
    <div>
      <div class="header">{{info.title}}</div>
      <div class="container">
        <img class="bg" src="~@img/class-course/score-bg.png">
        <div class="tip">{{info.tip}}</div>
        <div class="score-container text-center"><span class="score">{{info.score}}</span>分</div>
      </div>
      <div class="exam-info">
        <div class="title to" :title="info.name">
          {{info.name}}
        </div>
        <Table stripe :columns="columns" :data="[info]" class="table"></Table>
      </div>
      <div class="btn cp" v-show="show" @click="callback">
        {{info.btnText}}
      </div>

    </div>
    <img class="exam-result-bg" src="~@img/class-course/exam-result-bg.png">
  </div>
</template>

<script>
export default {
  name: 'base-view',
  props: ['info', 'columns', 'callback','show'],
}
</script>

<style lang="stylus" scoped>

.wrapper {
  width: 880px;
  height: 696px;
  background-color #fff;
  position relative;
  z-index 2;
  padding-top: 83px;
  .header {
    margin-left: 350px;
    font-size: 22px;
    font-weight: 800;
    color: rgba(0, 0, 0, 0.9);
    line-height: 22px;
  }
  // ---------成绩区域-------------
  .container {
    display: flex;
    flex-direction: column;
    position:relative;
    margin-top:25px;
    margin-left: 239px;
    width:337px;
    height: 158px;
    .bg {
      width:337px;
      height: 158px;
      position: absolute;
      left: 0;
      right: 0;
    }
    .tip {
      margin-left: 120px;
      font-size: 18px;
      font-weight: 500;
      color: #6A7487;
      line-height: 18px;
    }
    .score-container {
      margin-left:70px;
      margin-top: 33px;
      font-size: 30px;
      font-weight: 400;
      color: #000000;
      line-height: 48px;
      .score {
        width: 86px;
        height: 80px;
        font-size: 80px;
        font-family: DIN-Medium, DIN;
        font-weight: 500;
        color: $base;
        margin-right:9px;
        line-height: 80px;
      }
    }
  }
  // ----------考试信息区域------------
  .exam-info {
    margin-top: 38px;
    margin-left: 64px;
    .title {
      margin-left: 11px;
      font-size: 14px;
      font-weight: bold;
      color: #333333;
      line-height: 16px;
    }
    .table {
      margin-top: 12px;
      width: 752px;
    }
  }
  // -----------按钮----------
  .btn {
    margin-top: 40px;
    margin-left: 338px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 220px;
    height: 52px;
    background: $base;
    border-radius: 10px 10px 10px 10px;
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 19px;
  }
}
.exam-result-bg{
  position:absolute;
  top: 0;
  left: 0;
  width: 880px;
  height: 696px;
  z-index: -1;
}
</style>
