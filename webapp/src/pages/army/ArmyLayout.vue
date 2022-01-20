<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive"></router-view>

    <!-- 地图服务组件 -->
    <MapService ref="mapservice" />
  </div>
</template>

<script>
// import { mapState } from 'vuex'
// import thirdauth from '@/assets/js/thirdauthtool/thirdauth'
import MapService from '@/components/mapservice/MapService.vue'

export default {
  components: {
    MapService
  },

  data () {
    return {}
  },

  mounted () {
    // 偷偷先定位
    this.$refs.mapservice.F_getAccurateLocation(locationData => {
      console.log(locationData)
    })
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped></style>
