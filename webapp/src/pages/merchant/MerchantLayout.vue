<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>

    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import thirdauth from '@/assets/js/thirdauthtool/thirdauth'

export default {
  data () {
    return {
      // 登录 配置 等是否加载完毕
      init: false
    }
  },

  computed: mapState({

  }),

  mounted () {

  },

  methods: {
    // 商家机构登录
    F_loginMerchant () {
      this.$Api.common.merchantLogin()
    }
  }
}
</script>

<style></style>
