<template>
  <div :style="MapContainerStyle">
    <Baidu ref="map" v-if="useMapType == 'BaiDu'" />

    <Tencent ref="map" v-if="useMapType == 'Tencent'" />

    <Gaode ref="map" v-if="useMapType == 'GaoDe'" />

    <TDmap ref="map" v-if="useMapType == 'TianDiTu'" />
  </div>
</template>

<script>
/**
 * 地图服务组件
 * mapType 地图类型 GaoDe=高德地图 BaiDu=百度地图 Tencent=腾讯地图 TianDiTu=天地图
 */
import coordtransform from 'coordtransform'
import { mapState } from 'vuex'
import Baidu from './Baidu.vue'
import Gaode from './Gaode.vue'
import Tencent from './Tencent.vue'
import TDmap from './TDMap.vue'

export default {
  name: 'MapService',

  components: {
    Baidu,
    Gaode,
    Tencent,
    TDmap
  },

  props: {
    width: {
      type: String,
      default: '0'
    },

    height: {
      type: String,
      default: '0'
    }
  },

  data () {
    return {
      // 是否已经初始化进行了
      inited: false,

      // 当前使用的 地图类型
      useMapType: 'GaoDe',

      // 是否已经初始化完毕
      finishedInit: false,

      // 定位数据缓存有效时间 10 分钟
      cacheExpire: 600,

      // 地图定位返回数据标准
      locationData: {
        city: '杭州市',
        district: '拱墅区',
        province: '浙江省',
        lng: '',
        lat: ''
      }
    }
  },

  computed: mapState({
    MapContainerStyle () {
      return ['width:', this.width, ';', 'height:', this.height, ';'].join('')
    },

    // 地图类型 最终转换的 坐标数据类型
    mapType: 'mapType',

    // 浏览器环境参数 控制 当前所在平台 使用的地图
    browerEnvStatus: 'browerEnvStatus',

    // 地图定位缓存数据
    mapLocation (state) {
      return state.localData.mapLocation
    },

    // 用户位置数据
    userSelectCity (state) {
      return state.sessionData.userSelectCity
    }
  }),

  watch: {
    // 监听地图类型变化 进行初始化
    mapType () {
      if (!this.inited) {
        this.F_initMapService()
      }
    }
  },

  async mounted () {
    // 浙里办使用高德
    if (this.browerEnvStatus.zlb || this.browerEnvStatus.alipay) {
      this.useMapType = 'GaoDe'
    }

    // 微信使用腾讯
    if (this.browerEnvStatus.wx) {
      this.useMapType = 'Tencent'
    }

    const mapdata = await this.$Api.common.category(
      this.$Config.enumConfig.mapType
    )

    // 默认使用高德地图
    let mapType = 'GaoDe'

    if (mapdata && mapdata.code === 2000) {
      mapType = mapdata.result.length > 1 ? mapdata.result[1].value : 'GaoDe'
    }

    this.$store.commit('updateValue', { mapType: mapType })

    if (this.mapType && !this.inited) {
      this.F_initMapService()
    }

    // console.log(coordtransform)
  },

  methods: {
    // 清空覆盖物
    F_clearMap () {
      this.F_timerCheckerRun(() => {
        this.$refs.map.F_clearMap()
      })
    },

    // 添加地图标记
    F_addMark (lng, lat, options, withoutDeal) {
      this.F_timerCheckerRun(() => {
        if (!withoutDeal) {
          const LngLat = this.F_toMapData(lng, lat)

          lng = LngLat.lng
          lat = LngLat.lat
        }

        this.$refs.map.F_addMark(lng, lat, options || {})
      })
    },

    // 服务端坐标转换为当前使用地图的坐标
    F_toMapData (lng, lat) {
      if (this.useMapType === this.mapType) {
        return { lng: lng, lat: lat }
      }

      // 腾讯-高德 火星坐标 无需转换
      if (this.useMapType === 'GaoDe' && this.mapType === 'Tencent') {
        return { lng: lng, lat: lat }
      }

      // 百度-高德
      if (this.useMapType === 'GaoDe' && this.mapType === 'BaiDu') {
        const lngLat = coordtransform.gcj02tobd09(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 天地图-高德
      if (this.useMapType === 'GaoDe' && this.mapType === 'TianDiTu') {
        const lngLat = coordtransform.wgs84togcj02(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 腾讯-天地图
      if (this.useMapType === 'TianDiTu' && this.mapType === 'Tencent') {
        const lngLat = coordtransform.gcj02towgs84(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 高德-天地图
      if (this.useMapType === 'TianDiTu' && this.mapType === 'GaoDe') {
        const lngLat = coordtransform.gcj02towgs84(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 百度-天地图
      if (this.useMapType === 'TianDiTu' && this.mapType === 'BaiDu') {
        let lngLat = coordtransform.bd09togcj02(lng, lat)
        lngLat = coordtransform.gcj02towgs84(lngLat[0], lngLat[1])
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 百度-腾讯
      if (this.useMapType === 'Tencent' && this.mapType === 'BaiDu') {
        const lngLat = coordtransform.bd09togcj02(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 天地图-腾讯
      if (this.useMapType === 'Tencent' && this.mapType === 'TianDiTu') {
        const lngLat = coordtransform.wgs84togcj02(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 高德-百度   腾讯-百度
      if (
        this.useMapType === 'BaiDu' &&
        (this.mapType === 'GaoDe' || this.mapType === 'Tencent')
      ) {
        const lngLat = coordtransform.gcj02tobd09(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 天地图-百度
      if (this.useMapType === 'BaiDu' && this.mapType === 'TianDiTu') {
        let lngLat = coordtransform.wgs84togcj02(lng, lat)
        lngLat = coordtransform.gcj02tobd09(lngLat[0], lngLat[1])
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      return { lng: lng, lat: lat }
    },

    // 转换为服务端使用的地图坐标
    F_toServerData (lng, lat) {
      if (this.useMapType === this.mapType) {
        return { lng: lng, lat: lat }
      }

      // 腾讯-高德 火星坐标 无需转换
      if (this.useMapType === 'GaoDe' && this.mapType === 'Tencent') {
        return { lng: lng, lat: lat }
      }

      // 百度-高德
      if (this.useMapType === 'GaoDe' && this.mapType === 'BaiDu') {
        const lngLat = coordtransform.bd09togcj02(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 天地图-高德
      if (this.useMapType === 'GaoDe' && this.mapType === 'TianDiTu') {
        const lngLat = coordtransform.gcj02towgs84(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 腾讯-天地图
      if (this.useMapType === 'TianDiTu' && this.mapType === 'Tencent') {
        const lngLat = coordtransform.wgs84togcj02(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 高德-天地图
      if (this.useMapType === 'TianDiTu' && this.mapType === 'GaoDe') {
        const lngLat = coordtransform.wgs84togcj02(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 百度-天地图
      if (this.useMapType === 'TianDiTu' && this.mapType === 'BaiDu') {
        let lngLat = coordtransform.wgs84togcj02(lng, lat)
        lngLat = coordtransform.gcj02tobd09(lngLat[0], lngLat[1])
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 百度-腾讯
      if (this.useMapType === 'Tencent' && this.mapType === 'BaiDu') {
        const lngLat = coordtransform.gcj02tobd09(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 天地图-腾讯
      if (this.useMapType === 'Tencent' && this.mapType === 'TianDiTu') {
        const lngLat = coordtransform.gcj02towgs84(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 高德-百度   腾讯-百度
      if (
        this.useMapType === 'BaiDu' &&
        (this.mapType === 'GaoDe' || this.mapType === 'Tencent')
      ) {
        const lngLat = coordtransform.bd09togcj02(lng, lat)
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      // 天地图-百度
      if (this.useMapType === 'BaiDu' && this.mapType === 'TianDiTu') {
        let lngLat = coordtransform.bd09togcj02(lng, lat)
        lngLat = coordtransform.gcj02towgs84(lngLat[0], lngLat[1])
        return { lng: lngLat[0], lat: lngLat[1] }
      }

      return { lng: lng, lat: lat }
    },

    // GPS 坐标转换经纬度
    F_gpsTransformTolngLat (lng, lat) {
      let lngLat

      if (this.mapType === 'GaoDe') {
        lngLat = coordtransform.wgs84togcj02(lng, lat)
      }

      return {
        lat: lngLat[1],
        lng: lngLat[0]
      }
    },

    // 经纬度转换 GPS到其他地图 或者其他地图 到GPS
    F_lngLatTransformToGps (lng, lat) {
      let lngLat

      // 当前地图类型为高德
      if (this.mapType === 'GaoDe') {
        lngLat = coordtransform.gcj02towgs84(lng, lat)
      }

      return {
        lat: lngLat[1],
        lng: lngLat[0]
      }
    },

    // 关键词搜索
    F_searchKeyword (keyword, callback) {
      this.F_timerCheckerRun(async () => {
        const searchData = await this.$refs.map.F_searchKeyword(keyword)
        callback(searchData)
      })
    },

    // 获取地图当前中心位置
    F_getMapCenter () {
      const center = this.$refs.map.F_getMapCenter()
      return this.F_toServerData(center.lng, center.lat)
    },

    // 设置地图中心位置 withoutDeal 是否进行转换处理
    F_setMapCenter (lng, lat, withoutDeal) {
      this.F_timerCheckerRun(() => {
        if (withoutDeal) {
          this.$refs.map.F_setMapCenter(lng, lat)
        } else {
          const LngLat = this.F_toMapData(lng, lat)
          this.$refs.map.F_setMapCenter(LngLat.lng, LngLat.lat)
        }
      })
    },

    // 定位位置 对应 城市数据匹配
    F_cityDataPatch () {
      this.$Common.getCityByCode((cityData) => {
        // console.log('城市定位', cityData)
        let province = {}
        let city = {}
        let district = {}

        for (let i = 0; i < cityData.length; i++) {
          if (cityData[i].area_name === this.locationData.province) {
            province = cityData[i]

            for (let j = 0; j < province.children.length; i++) {
              if (province.children[j].area_name === this.locationData.city) {
                city = province.children[j]

                for (let k = 0; k < city.children.length; k++) {
                  if (city.children[k].area_name === this.locationData.district) {
                    district = city.children[k]
                    break
                  }
                }
                break
              }
            }
            break
          }
        }

        const keys = {
          area_name: true,
          area_code: true,
          parent_code: true,
          level: true
        }

        const _province = {}
        const _city = {}
        const _district = {}

        for (const key in keys) {
          _province[key] = province[key]
          _city[key] = city[key]
          _district[key] = district[key]
        }

        // 如果用户当前没有选择固定所在的城市
        if (!this.userSelectCity.area_code) {
          this.$store.commit('updateSessionData', {
            userSelectCity: {
              province: _province,
              city: _city,
              district: _district,
              area_name: _district.area_name,
              area_code: _district.area_code,
              level: 3
            }
          })
        }

        console.log('定位城市匹配', {
          province: _province,
          city: _city,
          district: _district
        })

        this.$store.commit('updateLocalData', {
          mapCityData: {
            province: _province,
            city: _city,
            district: _district
          }
        })
      })
    },

    // 地图服务初始化
    F_initMapService () {
      this.inited = true
      // console.log('开始地图初始化')

      setTimeout(() => {
        // console.log(this.$refs.map)

        this.$refs.map.F_initMap(() => {
          // console.log('地图初始化完毕')
          this.finishedInit = true
        })
      }, 300)
    },

    // 获取粗略定位信息
    F_getLocation (callback) {
      if (!this.finishedInit) {
        this.F_timerCheckerRun(() => {
          this.F_getLocation(callback)
        })
        return
      }

      this.$refs.map.F_getLocation(callback)
    },

    // 获取精准定位信息
    F_getAccurateLocation (callback) {
      // const now = parseInt(new Date().getTime() / 1000)

      // 是否使用缓存数据
      // if (
      //   now - this.mapLocation.timestamp < this.cacheExpire &&
      //   this.mapLocation.timestamp > 0
      // ) {
      //   console.log('使用了缓存数据')

      //   // 匹配城市数据
      //   this.F_cityDataPatch()

      //   callback(this.$store.state.localData.mapLocation)
      //   return
      // }

      if (!this.finishedInit) {
        this.F_timerCheckerRun(() => {
          this.F_getAccurateLocation(callback)
        })
        return
      }

      // 使用地图组件 进行定位
      this.$refs.map.F_getAccurateLocation(locationData => {
        console.log(locationData)

        locationData.timestamp = parseInt(new Date().getTime() / 1000)

        // 服务端坐标 使用数据
        const serverLngLat = this.F_toServerData(locationData.lng, locationData.lat)

        // 记录当前使用地图坐标位置
        const mapLngLat = { lng: locationData.lng, lat: locationData.lat }

        locationData.lng = serverLngLat.lng
        locationData.lat = serverLngLat.lat

        locationData.mapLngLat = mapLngLat

        this.locationData = locationData

        // 匹配城市数据
        this.F_cityDataPatch()

        // 共享到vuex
        this.$store.commit('updateMapLocation', locationData)
      })
    },

    /**
     * 所有功能使用 未初始化被挂起 完成 初始化后 重新触发函数 并回调
     */
    F_timerCheckerRun (callback) {
      setTimeout(() => {
        if (this.finishedInit) {
          callback()
        } else {
          this.F_timerCheckerRun(callback)
        }
      }, 300)
    }
  }
}
</script>

<style></style>
