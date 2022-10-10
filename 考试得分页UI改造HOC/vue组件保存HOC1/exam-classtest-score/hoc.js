export default function (view, params) {
  const { props, events } = params
  return {
    //不通用，按理说，参数是要保持一致的,这是适配的办法,或者说是兼容的办法
    props: ['from', 'info', 'scoreInfo', 'isGrowth','show'],
    data() { //公共数据
      return {
        loading: true,
      }
    },
    methods: { //与方法
      ...events,
    },
    created() {
      // console.log(this[props.key])
    },
    render(h) {
      const args = {
        props: {
          info: events.initData.call(this),
          columns: props.columns,
          callback: events.toAnalysis.bind(this),
          show:this.show === 0 ? false: true,
        },
      }
      const wrapper = h('div', null, [
        this.loading ? h(view, args) : null
      ])
      return wrapper
    }
  }
}
