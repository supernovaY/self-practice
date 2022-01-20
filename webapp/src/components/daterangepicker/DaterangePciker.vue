<template>
  <!-- 城市选择组件 -->
  <van-popup v-model="pagestatus.showCitySelect" position="bottom">
    <div class="picker-bar">
      <div class="j-m j-flex j-flex-center">
        <div>
          <span
            class="j-fc-gray"
            @click="pagestatus.showCitySelect = false">
            取消
          </span>
        </div>

        <div class="flex">
          <div class="rangeshow">
            <span
              :class="pagestatus.showindex == 1 ? 'rangitem active' : 'rangitem'"
              @click="pagestatus.showindex = 1">
              {{ data.date1.Format('yyyy-MM-dd') }}
            </span>
            至
            <span
              :class="pagestatus.showindex == 2 ? 'rangitem active' : 'rangitem'"
              @click="pagestatus.showindex = 2">
              {{ data.date2.Format('yyyy-MM-dd') }}
            </span>
          </div>
        </div>

        <div>
          <span
            class="j-fc-blue"
            @click="F_confirmSelect">
            确定
          </span>
        </div>
      </div>
    </div>

    <div>
      <van-datetime-picker
        v-show="pagestatus.showindex == 1"
        v-model="data.date1"
        :min-date="data.mindate"
        :max-date="data.maxdate"
        type="date"
        :show-toolbar="false"
        :formatter="F_formatter"
        ref="picker1"
      />

      <van-datetime-picker
        v-show="pagestatus.showindex == 2"
        v-model="data.date2"
        type="date"
        :min-date="data.mindate"
        :max-date="data.maxdate"
        :show-toolbar="false"
        :formatter="F_formatter"
        ref="picker2"
      />
    </div>
  </van-popup>
</template>

<script>
export default {
  name: 'DaterangePicker',

  data () {
    const nowYear = new Date().getFullYear()
    const maxdate = new Date()
    maxdate.setFullYear(nowYear + 100)

    const mindate = new Date()
    mindate.setFullYear(nowYear - 100)
    return {
      // 页面状态控制
      pagestatus: {
        showCitySelect: false,

        // 时间段显示 1 2
        showindex: 1
      },

      // 数据存放对象
      data: {
        date1: new Date(),
        date2: new Date(),

        // 最大最小可选日期
        maxdate: maxdate,
        mindate: mindate
      }
    }
  },

  methods: {
    // 打开窗口
    F_show () {
      this.pagestatus.showCitySelect = true
    },

    // 隐藏窗口
    F_hide () {
      this.pagestatus.showCitySelect = false
    },

    // 日期格式转换
    F_formatter (type, val) {
      if (type === 'year') {
        return val + '年'
      }
      if (type === 'month') {
        return val + '月'
      }
      if (type === 'day') {
        return val + '日'
      }
      return val
    },

    // 确认选择城市
    F_confirmSelect (evt) {
      if (
        parseInt(this.data.date1.Format('yyyyMMdd')) >
        parseInt(this.data.date2.Format('yyyyMMdd'))
      ) {
        this.$toast('开始时间无法大于结束时间')
        return
      }

      this.F_hide()

      this.$emit(
        'selected',
        {
          date1: this.data.date1,
          date2: this.data.date2
        }
      )
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
