<template>
  <!-- 城市选择组件 -->
  <van-popup v-model="pagestatus.show" position="bottom">
    <van-picker
      title="选择年份"
      show-toolbar
      :columns="data.dateOption"
      @confirm="F_confirmSelect"
      @cancel="pagestatus.show = false"
    />
  </van-popup>
</template>

<script>
export default {
  name: 'YearRangePicker',

  props: {
    // 范围当前时间
    rangback: {
      type: Number,
      default: 100
    },
    rangego: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      // 页面状态控制
      pagestatus: {
        show: false
      },

      // 数据存放对象
      data: {
        dateOption: [
          // 第一列
          {
            values: [],
            defaultIndex: parseInt(this.rangback / 2)
          },
          // 第二列
          {
            values: [],
            defaultIndex: 0
          }
        ]
      }
    }
  },

  mounted () {
    this.F_initOption()
  },

  methods: {
    // 初始化选项
    F_initOption () {
      const nowYear = parseInt(new Date().Format('yyyy')) + 1
      const endYear = nowYear + this.rangego

      const OptionList = []
      // console.log(nowYear, endYear)
      for (let i = nowYear - this.rangback; i < endYear; i++) {
        OptionList.push(i + '年')
      }

      OptionList.reverse()
      this.data.dateOption[0].values = OptionList
      this.data.dateOption[1].values = OptionList
    },

    // 打开窗口
    F_show () {
      this.pagestatus.show = true
    },

    // 隐藏窗口
    F_hide () {
      this.pagestatus.show = false
    },

    // 确认选择
    F_confirmSelect (evt) {
      // console.log(evt)
      if (
        parseInt(evt[0]) >
        parseInt(evt[1])
      ) {
        this.$toast('开始时间无法大于结束时间')
        return
      }

      this.F_hide()

      this.$emit('selected', [parseInt(evt[0]), parseInt(evt[1])])
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";

.picker-bar{
  background: #FFF;
  padding: 12px 0;
}

.rangeshow{
  text-align: center;
}

.rangitem{
  display: inline-block;
  padding: 4px 8px;
  margin: 0 8px;
  border-bottom: 1px solid rgba(0,0,0,0);

  &.active{
    border-bottom: 1px solid $--color-primary;
  }
}
</style>
