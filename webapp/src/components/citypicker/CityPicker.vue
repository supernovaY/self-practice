<template>
  <!-- 城市选择组件 -->
  <van-popup v-model="pagestatus.showCitySelect" position="bottom">
    <van-picker
      ref="citypicker"
      show-toolbar
      title="选择城市"
      :columns="data.cityData"
      value-key="area_name"
      @confirm="F_confirmCity"
      @cancel="pagestatus.showCitySelect = false"
    />
  </van-popup>
</template>

<script>
// import cityData from '@/assets/data/citydata.json'

export default {
  name: 'CityPicker',

  props: {
    // 选择可到级别 1：2，3， 1可选 2：2，3级可选  3：只能选3级可选
    cityLevel: {
      type: Number,
      default: 2
    }
  },

  data () {
    return {
      // 页面状态控制
      pagestatus: {
        showCitySelect: false
      },

      // 数据存放对象
      data: {
        // 城市数据
        cityData: []
      }
    }
  },

  mounted () {
    this.F_initCityData()
  },

  methods: {
    // 打开窗口
    F_show () {
      this.pagestatus.showCitySelect = true
    },

    F_hide () {
      this.pagestatus.showCitySelect = false
    },

    // 城市数据 直到三级 目前限制为浙江省
    async F_initCityData () {
      if (this.cityLevel === 0) {
        this.F_getDataLevel(0, (data) => {
          this.data.cityData = data
        })
        return
      }

      if (this.cityLevel === 1) {
        this.F_getDataLevel(1, (data) => {
          this.data.cityData = [data]
        })
        return
      }

      // console.log('省份数据初始化', this.cityLevel)
      if (this.cityLevel === 2) {
        const data = await this.$Common.getProvinceData()
        // console.log('省份数据', data)
        this.data.cityData = [data]
        return
      }

      if (this.cityLevel === 3) {
        this.F_getDataLevel(3, (data) => {
          this.data.cityData = [data]
        })
      }
    },

    // 获取城市级别可选数据
    F_getDataLevel (cityLevel, callback) {
      // 全国可选
      if (cityLevel === 0) {
        this.$Common.getCityByCode((data) => {
          const cityData = JSON.parse(JSON.stringify(data))
          // console.log(cityData)

          cityData.map((item) => {
            item.children.unshift({
              area_code: '',
              area_name: '请选择',
              parent_code: 0,
              level: 0,
              children: [{
                area_code: '',
                area_name: '',
                parent_code: 0,
                level: 0
              }]
            })

            item.children.map((subItem) => {
              subItem.children.unshift({
                area_code: '',
                area_name: '请选择',
                parent_code: 0,
                level: 0
              })
            })
          })

          callback(cityData)
        })
        return
      }

      this.$Common.getCityByCode((data) => {
        const cityData = JSON.parse(JSON.stringify(data))

        if (cityLevel === 1) {
          cityData.children.map((item) => {
            item.children.unshift({
              area_code: '',
              area_name: '请选择',
              parent_code: 0,
              level: 0
            })

            item.children.map((sunItem) => {
              delete sunItem.children
            })
          })

          cityData.children.unshift({
            area_code: '',
            area_name: '请选择',
            parent_code: 0,
            level: 0,
            children: [{
              area_code: '',
              area_name: '',
              parent_code: 0,
              level: 0
            }]
          })
        }

        // console.log('城市数据', cityData)

        callback(cityData)
      }, this.$store.state.zlbConfig.cityCode || this.$Config.cityCode)
    },

    // 确认选择城市
    F_confirmCity (evt) {
      const cityData = this.$refs.citypicker.getValues()

      this.pagestatus.showCitySelect = false

      this.$emit('selected', cityData)
    }
  }
}
</script>
