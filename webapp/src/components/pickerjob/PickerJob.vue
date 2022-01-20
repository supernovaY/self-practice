<template>
  <!-- 城市选择组件 -->
  <van-popup v-model="pagestatus.show" position="bottom">
    <van-picker
      show-toolbar
      ref="picker"
      title="选择岗位"
      :columns="data.dataList"
      value-key="label"
      @confirm="F_selectItem"
      @cancel="pagestatus.show = false"
    />
  </van-popup>
</template>

<script>
/**
 * 岗位类型选择组件
 * 功能1 弹窗选择
 * 功能2 获取code 值对应的中文
 * 功能3 获取搭一搭回显使用的 完整的数组字符串
 */
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
        // 岗位数据
        dataList: [],

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

    // 加载岗位数据
    async F_initData () {
      const data = await this.$Api.common.categoryData.categoryJob()

      if (data.code === 2000) {
        const copyData = JSON.parse(JSON.stringify(data.result))

        const deal = (item) => {
          this.data.linkObjct[item.value] = item

          if (item.children && item.children.length > 0) {
            item.children.map((subItem) => {
              subItem.parentItem = item
              deal(subItem)
            })
          }
        }

        copyData.map((item) => {
          deal(item)
        })

        // console.log(data.result)
        this.data.dataList = data.result
      }
    },

    /**
     * 确定选择
     */
    F_selectItem (item) {
      const data = this.$refs.picker.getValues()
      // console.log(item)
      // console.log(data)

      const values = []
      const pickers = []

      data.map((item) => {
        pickers.push(item)
        values.push(item.value)
      })

      this.pagestatus.show = false

      this.$emit('select', {
        pickers: pickers,
        values: values,
        pickItem: data[data.length - 1],
        value: data[data.length - 1].value,
        labels: item
      })
    },

    // 获取一个选项的数据信息 回显初始化使用
    F_getOptionData (code) {
      if (this.data.linkObject[code]) {
        const data = this.data.linkObject[code]

        const values = []
        const pickers = []

        const deal = (item) => {
          pickers.push(item)
          values.push(item.value)

          if (item.parentItem) {
            deal(item.parentItem)
          }
        }

        deal(data)

        return {
          pickers: pickers,
          values: values,
          pickItem: data,
          value: data.value,
          labels: [data.label, data.parentItem.label]
        }
      }

      return false
    }
  }
}
</script>
