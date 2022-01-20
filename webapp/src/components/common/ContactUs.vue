<template>
  <div ref="drager" class="contactusfixed">
    <div class="content">
      <span class="fas fa-comment-dots"></span> 码上咨询
    </div>
  </div>
</template>

<script>
import alloyfinger from '@/assets/js/alloyfinger/alloyfinger.js'

export default {
  name: 'Common-ContactUs',

  data () {
    return {
      height: window.innerHeight
    }
  },

  mounted () {
    this.F_initTouch()
  },

  methods: {
    F_initTouch () {
      const dom = this.$refs.drager

      alloyfinger.Tranform(dom)

      /* eslint-disable no-new */
      new alloyfinger.AlloyFinger(dom, {
        // 触摸移动
        pressMove: evt => {
          evt.preventDefault()

          // 下滑正数 上划负数
          dom.translateY += evt.deltaY
          dom.translateX += evt.deltaX
        },

        // 触屏结束
        multipointEnd: evt => {
          evt.preventDefault()

          new alloyfinger.To(
            dom,
            'translateX',
            0,
            300,
            alloyfinger.ease
          )

          if (
            dom.translateY > this.height * 0.2 ||
            dom.translateY < -this.height * 0.8 + 40
          ) {
            new alloyfinger.To(
              dom,
              'translateY',
              0,
              300,
              alloyfinger.ease
            )
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contactusfixed {
  position: fixed;
  right: -17px;
  bottom: 20%;
  z-index: 99;
  font-size: 12px;
  .content {
    color: #fff;
    background-color: #404956;
    border-radius: 17px;
    padding: 8px 30px 8px 12px;
    opacity: 0.76;
  }
}
</style>
