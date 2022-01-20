<template>
  <div>
    <div v-if="$route.path === '/'" class="j-m pagefooter">
      <Common-PageDevideHeight />
      <Common-PageDevideHeight />
      <Common-PageDevideHeight />

      <div>本服务由浙江政府服务网、浙江省退役军人事务厅提供</div>
      <div class="divideheight"></div>
      <div>服务咨询热线：<Common-PhoneCall :telephone="telephone" /></div>

      <Common-PageDevideHeight />
      <Common-PageDevideHeight />
      <Common-PageDevideHeight />
    </div>

    <div v-if="$route.path != '/'" class="j-m pagefooter">
      <Common-PageDevideHeight />
      <Common-PageDevideHeight />
      <Common-PageDevideHeight />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Common-PageFooter',

  data () {
    return {
      telephone: '0571-87665890'
    }
  },

  computed: mapState({
    browerEnvStatus: 'browerEnvStatus'
  }),

  mounted () {
    // console.log(this.browerEnvStatus)
  },

  methods: {
    // 拨打电话 浙里办App 不支持 标签 tel
    F_phoneCall () {
      window.ZWJSBridge.phoneCall({
        corpId: this.telephone
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagefooter{
  font-size: 12px;
  text-align: center;
  color: #808da1;
}

.divideheight {
  height: 8px;
}
</style>
