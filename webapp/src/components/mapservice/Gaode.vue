<template>
  <div ref="map" class="map"></div>
</template>

<script>
export default {
  data () {
    return {}
  },

  beforeDestroy () {
    if (this.map) {
      this.map.destroy()
    }
  },

  methods: {
    // 清空所有覆盖物
    F_clearMap () {
      this.map.clearMap()
    },

    // 添加标记点
    F_addMark (lng, lat, options) {
      var marker = new window.AMap.Marker({
        // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
        position: new window.AMap.LngLat(lng, lat),
        title: options.title ? options.title : ''
      })

      // 将创建的点标记添加到已有的地图实例：
      this.map.add(marker)

      if (options.label) {
        marker.setLabel({
          // 设置文本标注偏移量
          offset: new window.AMap.Pixel(20, 0),

          // 设置文本标注内容
          content: options.label,

          // 设置文本标注方位
          direction: 'right'
        })
      }
    },

    // 关键词搜索
    F_searchKeyword (keyword) {
      return new Promise((resolve, reject) => {
        const placeSearch = new window.AMap.PlaceSearch({
          city: '全国',
          pageSize: 50
        })

        placeSearch.search(keyword, (status, result) => {
          // 搜索成功时，result即是对应的匹配数据
          console.log(result)

          const resultData = []

          if (result.info === 'OK') {
            const poisList = result.poiList.pois

            poisList.map((item) => {
              resultData.push({
                name: item.name,
                address: item.address,
                lng: item.location.lng,
                lat: item.location.lat,
                mapType: 'gaodemap'
              })
            })
          }

          // 处理数据到 统一格式
          resolve(resultData)
        })
      })
    },

    // 获取地图中心位置
    F_getMapCenter () {
      const center = this.map.getCenter()
      return { lng: center.lng, lat: center.lat }
    },

    // 设置地图中心位
    F_setMapCenter (lng, lat) {
      this.map.setCenter(new window.AMap.LngLat(lng, lat))
    },

    // 浏览器粗略定位
    F_getLocation (callback) {
      const result = {
        city: '',
        district: '',
        province: '',
        lng: '',
        lat: ''
      }

      const center = this.map.getCenter()
      // console.log(center)

      // 经纬度
      result.lat = center.lat
      result.lng = center.lng

      this.map.getCity(data => {
        // console.log(data)

        result.city = data.city
        result.district = data.district
        result.province = data.province

        callback(result)
      })
    },

    // 精准定位
    F_getAccurateLocation (callback) {
      const _vue = this
      const AMap = window.AMap

      // 检查浏览器环境是否为 https 不是则无法使用精准定位
      const geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        // timeout: 10000,
        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        buttonOffset: new AMap.Pixel(10, 20),
        // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        // 定位按钮的排放位置,  RB表示右下
        buttonPosition: 'RB'
      })

      function onComplete (data) {
        // data是具体的定位信息
        console.log('定位信息', data)

        const result = {
          city: '',
          district: '',
          province: '',
          lng: '',
          lat: ''
        }

        const cityDetail = data.addressComponent
        const position = data.position

        // 经纬度
        result.lat = position.lat
        result.lng = position.lng

        result.city = cityDetail.city
        result.district = cityDetail.district
        result.province = cityDetail.province

        callback(result)
      }

      function onError (data) {
        // 定位出错
        console.log('精准定位失败', data)

        // 使用浏览器定位
        _vue.F_getLocation(callback)
      }

      geolocation.getCurrentPosition()
      AMap.event.addListener(geolocation, 'complete', onComplete)
      AMap.event.addListener(geolocation, 'error', onError)
    },

    // 初始化高德地图 示例工具
    F_initMapTool () {
      const AMap = window.AMap

      this.map = new AMap.Map(this.$refs.map, {
        resizeEnable: true,
        zoom: 18
      })
    },

    // 地图初始化
    F_initMap (callback) {
      this.$Common.loadScript(this.$Config.mapConfig.gaode).then(() => {
        this.F_checkMapInit(() => {
          // 初始化一个示例 用于粗略定位或者 显示使用
          this.F_initMapTool()

          callback()
        })
      })
    },

    // 检查地图对象是否加载完毕
    F_checkMapInit (callback) {
      setTimeout(() => {
        if (window.AMap) {
          callback()
        } else {
          this.F_checkMapInit(callback)
        }
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

<style scoped>
  .map >>> .amap-marker-label{
    border: none;
    padding: 5px;
    box-shadow: 0 2px 6px rgba(0,0,0,.1);
  }
</style>
