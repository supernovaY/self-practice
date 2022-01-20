<template>
  <div>
    <SelectPosition ref="mapselector" @select="F_select"></SelectPosition>
  </div>
</template>

<script>
import SelectPosition from '@/components/mapservice/SelectPosition.vue'

export default {
  components: {
    SelectPosition
  },
  data () {
    return {
      // 页面状态控制
      pagestatus: {

      }
    }
  },

  mounted () {
    this.F_init()
  },

  methods: {
    // 选择回调
    F_select (positionData) {
      // console.log(positionData)

      // 向来源页面传参
      this.$store.commit(
        'sendMultyPageParam',
        [
          {
            path: this.$route.query.redirectUrl,
            data: { action: 'mapselectposition', data: positionData }
          }
        ]
      )

      this.$router.back()
      // this.$router.push(this.$route.query.redirectUrl)
    },

    // 初始化设置参数
    F_init () {
      console.log(this.$route)

      const pageParam = this.$route.query

      const option = {}

      // 中心位置设置
      if (pageParam.lng && pageParam.lat) {
        option.lng = pageParam.lng
        option.lat = pageParam.lat
      }

      this.$refs.mapselector.F_init(option)

      if (pageParam.keyword) {
        this.$refs.mapselector.F_setDefaultKeyWord(pageParam.keyword)
      }
    }
  }
}
</script>
