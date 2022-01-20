<template>
  <div
    class="pagecontainer j-flex j-flex-vtc"
    :style="'background:' + background"
  >
    <div>
      <slot name="header"></slot>
    </div>

    <div class="flex">
      <div class="j-fullcontent">
        <div ref="content" class="j-fullscrollcontent" @scroll="F_scroll">
          <slot name="content"></slot>
        </div>
      </div>

      <!-- 返回头部 -->
      <div v-if="showToTop">
        <div
          v-show="showScrollToTop"
          @click="F_scrollTopTop"
          class="toTop">
          <span class="j-fc-blue fas fa-arrow-up"></span>
        </div>
      </div>

      <!-- 同层级页面插入 -->
      <slot name="othercontent"></slot>

      <!-- 底部悬浮内容 -->
      <div class="fixbottom">
        <slot name="fixbottom"></slot>
      </div>
    </div>

    <div>
      <!-- 底部固定内容 -->
      <slot name="bottom"></slot>
    </div>
  </div>
</template>

<script>
/**
 * 全局通用手机端页面布局
 */
export default {
  name: 'Common-PageContainer',

  props: {
    // 触发滚动加载高度
    scrollLoad: {
      type: Number,
      default: 40
    },

    background: {
      type: String,
      default: '#F4FAFF'
    },

    // 是否显示返回顶部
    showToTop: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      // 滚动条高度
      scrollTop: 0,

      // 是否显示返回头部
      showScrollToTop: false
    }
  },

  computed: {},

  activated () {
    // console.log(this.scrollTop)
    setTimeout(() => {
      if (this.$refs.content) {
        this.$refs.content.scrollTop = this.scrollTop
        this.showScrollToTop = this.$refs.content.scrollTop > 200
      }
    }, 100)
  },

  methods: {
    F_scroll (e) {
      this.scrollTop = e.target.scrollTop
      // console.log(this.scrollTop)
      this.$emit('scroll', this.scrollTop)

      this.showScrollToTop = this.scrollTop > 200

      const bottomDistance =
        e.target.scrollHeight - (e.target.scrollTop + e.target.clientHeight)

      // 触发滚动加载事件
      if (bottomDistance <= this.scrollLoad) {
        this.$emit('scrollLoad', bottomDistance)
      }
    },

    // 滚动返回头部
    F_scrollTopTop () {
      this.F_scrollTo(0)
    },

    F_scrollTo (x) {
      const distance = Math.abs(this.$refs.content.scrollTop - x)

      const step = (distance * 0.05) * (this.$refs.content.scrollTop > x ? -1 : 1)

      let divide = Math.abs(parseInt(distance / step))

      const timerInterval = setInterval(() => {
        this.$refs.content.scrollTop += step

        divide--

        if (divide <= 0) {
          clearInterval(timerInterval)
          this.$refs.content.scrollTop = x
        }
      }, 10)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagecontainer {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.pagecontainer .van-pull-refresh {
  width: 100%;
  height: 100%;
}

.fixbottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 101;
}

.toTop{
  position: absolute;
  right: 12px;
  bottom: 10%;
  width: 36px;
  height: 36px;
  box-shadow: 0 2px 6px rgba(0,0,0,.2);
  border-radius: 50%;
  text-align: center;
  font-size: 16px;
  line-height: 36px;
  background: rgba(255,255,255,.8);
  z-index: 10;
}
</style>
