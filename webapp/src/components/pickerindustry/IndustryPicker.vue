<template>
  <van-popup v-model="pagestatus.show" position="bottom">
    <van-tree-select
      :items="data.pickerData"
      @click-item="F_selectItem"
      height="75vh"
      :main-active-index.sync="formdata.activeId"
      :active-id.sync="formdata.activeSubId" />
  </van-popup>
</template>

<script>
import { mapState } from 'vuex'
/**
 * 行业类型选择组件
 * 功能1 弹窗选择
 * 功能2 获取code 值对应的中文
 * 功能3 获取搭一搭回显使用的 完整的数组字符串
 */
export default {
  name: 'IndustryPicker',
  props: {
    checkedSubId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      // 页面状态控制
      pagestatus: {
        show: false
      },

      // 数据绑定对象
      formdata: {
        // 第一列 选项ID
        activeId: 0,

        // 第二列 选项ID
        activeSubId: 0
      },

      // 数据存放对象
      data: {
        // 选项数据
        pickerData: [],

        // 关联关系对象
        linkObject: {}
      }
    }
  },

  computed: {
    ...mapState({
      // 行业数据
      allIndustry (state) {
        return state.allIndustry
      }
    })
  },

  mounted () {
    if (!this.allIndustry || this.allIndustry.length === 0) {
      this.F_initData()
    } else {
      this.data.pickerData = this.allIndustry
    }
  },

  methods: {
    // 打开窗口
    F_show () {
      this.pagestatus.show = true
    },

    // 关闭
    F_hide () {
      this.pagestatus.show = false
    },

    // 城市数据 直到三级 目前限制为浙江省
    async F_initData () {
      const data = await this.$Api.common.categoryData.categoryIndustry()

      const deal = (item) => {
        item.text = item.label
        item.id = item.value
        this.data.linkObject[item.value] = item

        if (item.children && item.children.length > 0) {
          item.children.map((subItem) => {
            subItem.parentItem = item
            deal(subItem)
          })
        }
      }

      if (data.code === 2000) {
        data.result.map((item) => {
          deal(item)
        })

        this.data.pickerData = data.result
        this.$store.commit('updateValue', { allIndustry: data.result }) // 更新行业数据
        this.getMainIndustryIndex()
      }
    },

    // 获取一个选项的数据信息 回显初始化使用
    F_getOptionData (code) {
      if (this.data.linkObject[code]) {
        const data = this.data.linkObject[code]
        return {
          pickers: [data.parentItem, data],
          values: [data.parentValue, data.value],
          pickItem: data,
          value: data.value,
          labels: [data.parentItem.label, data.label]
        }
      }

      return false
    },

    // 选择选项
    F_selectItem (data) {
      // console.log(data)
      this.$emit('select', {
        pickers: [data.parentItem, data],
        values: [data.parentValue, data.value],
        pickItem: data,
        value: data.value,
        labels: [data.parentItem.label, data.label]
      })
      this.pagestatus.show = false
    },

    // 获取一级行业index，用于编辑时回显
    getMainIndustryIndex () {
      // 根据行业二级value 截掉'_10' 即为一级value
      if (this.checkedSubId && this.checkedSubId.lastIndexOf('_') > 0) {
        const _mainVal = this.checkedSubId.substring(0, this.checkedSubId.lastIndexOf('_'))
        for (let i = 0; i < this.allIndustry.length; i++) {
          if (this.allIndustry[i].value === _mainVal) { // 根据一级行业value获取index
            this.formdata.activeId = i
            break
          }
        }
      }
    }
  },
  watch: {
    checkedSubId (val) {
      this.formdata.activeSubId = val
      this.getMainIndustryIndex()
    }
  }
}
</script>
