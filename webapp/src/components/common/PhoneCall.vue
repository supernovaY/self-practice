<template>
  <span>
    <span
      v-if="browerEnvStatus.zlb"
      :class="className"
      :style="color ? 'color:' + color : ''"
      @click.stop="F_phoneCall">
      {{ telephone }}
    </span>
    <a
      v-if="!browerEnvStatus.zlb"
       @click.stop
      :class="className"
      :style="color ? 'color:' + color : ''"
      :href="'tel:' + telephone"
      >{{ telephone }}</a
    >
  </span>
</template>

<script>
/**
 * 拨打电话兼容处理组件 浙里办App a标签不支持tel:
 */
import { mapState } from 'vuex'

export default {
  name: 'Common-PhoneCall',

  props: {
    telephone: {
      type: String,
      default: '',
      required: true
    },

    color: {
      type: String,
      default: ''
    },

    // 是否使用下划线
    underline: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {}
  },

  computed: mapState({
    browerEnvStatus: 'browerEnvStatus',

    // 样式处理
    className () {
      const classList = []

      if (this.color === '') {
        classList.push('j-fc-blue')
      }

      if (this.underline) {
        classList.push('telephone')
      }

      return classList.join(' ')
    }
  }),

  mounted () {},

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
  .telephone{
    text-decoration: underline;
  }
</style>
