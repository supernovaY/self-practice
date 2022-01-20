<template>
  <!-- 城市选择组件 -->
  <van-popup v-model="pagestatus.show" position="bottom">
    <van-picker
      show-toolbar
      ref="moneyrangepick"
      title="选择薪资区间"
      :columns="data.moneyList"
      value-key="label"
      @confirm="F_selectMoneyRange"
      @cancel="pagestatus.show = false"
    />
  </van-popup>
</template>

<script>

export default {
  name: 'PickerJob',

  data () {
    return {
      // 页面状态控制
      pagestatus: {
        show: false
      },

      // 数据存放对象
      data: {
        // 薪资数据
        moneyList: [],

        // 关联对象
        linkObjct: {}
      }
    }
  },

  mounted () {
    this.F_initData()
  },

  methods: {
    // 打开窗口
    F_show () {
      this.pagestatus.show = true
    },

    F_hide () {
      this.pagestatus.show = false
    },
    F_initData () {
      const moneyRange = [0, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
      moneyRange.map((item, index) => {
        const children = []
        for (let i = index + 1; i < moneyRange.length; i++) {
          children.push({
            label: moneyRange[i] >= 10 ? (moneyRange[i] / 10) + '万' : moneyRange[i] + '千',
            value: moneyRange[i]
          })
        }
        children.push({ label: '不限', value: 99999 }) // 薪资最高点设置为99999
        this.data.moneyList.push({
          label: item >= 10 ? (item / 10) + '万' : item + '千',
          value: item,
          children: children
        })
      })
    },

    /**
     * 确定选择
     */
    F_selectMoneyRange () {
      this.pagestatus.show = false
      const data = this.$refs.moneyrangepick.getValues()
      this.$emit('confirmSalary', { min: data[0].value, max: data[1].value })
    }
  }
}
</script>
