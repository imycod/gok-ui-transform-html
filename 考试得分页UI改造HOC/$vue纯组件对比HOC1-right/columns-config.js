const testResultColumns = [
  {
    title: '姓名',
    key: 'userName',
    align: 'center'
  },
  {
    title: '交卷时间',
    key: 'submitTimeFormat',
    align: 'center'
  },
  {
    title: '用时',
    key: 'spentTimeFormat',
    align: 'center'
  },
  {
    title: '成绩',
    key: 'stuScore',
    align: 'center'
  },
  {
    title: '正确率',
    key: 'correctRate',
    align: 'center'
  },
  {
    title: '得分率',
    key: 'scoreRete',
    align: 'center'
  }
]

const examOrTestColumn1 = {
  title: '考试名称',
  key: 'name',
  align: 'center'
}

const examOrTestColumns = [
  // examOrTestColumn1,
  {
    title: '姓名',
    key: 'userName',
    align: 'center'
  },
  {
    title: '交卷时间',
    key: 'submitTime',
    align: 'center'
  },
  {
    title: '用时',
    key: 'spentTime',
    align: 'center'
  },
  {
    title: '成绩',
    key: 'score',
    align: 'center'
  },
  {
    title: '正确率',
    key: 'correctRate',
    align: 'center'
  },
  {
    title: '得分率',
    key: 'scoreRete',
    align: 'center'
  }
]

// 区分columnsKey
export default {
  test:testResultColumns, // 学生班课table列表
  exam:examOrTestColumns, // 测试和考试table列表
}
