<template>
  <div class="menulist">
    <div
      v-for="(item, index) in menuList"
      :key="index"
      class="item"
      @click="F_jumpUrl(item)">
      <div>
        <span
          class="img-icon"
          :style="'background-image:url(' + item.icon + ')'"
        ></span>
      </div>

      <span>{{ item.appTitle }}</span>
    </div>

    <router-link to="/army/allapplication" class="item">
      <div>
        <span class="img-icon img-icon-allapplication"></span>
      </div>

      <span>全部</span>
    </router-link>
  </div>
</template>

<script>
/**
 * 老兵码首页 常用菜单
 */
import dataCounter from '@/assets/js/datacounter/counter.js'

export default {
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {}
  },

  methods: {
    // url 跳转处理
    F_jumpUrl (item) {
      // 统计埋点
      dataCounter.menuEnterCount(item.appKey, () => {
        this.$Common.urlJump(item.directUrl)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.menulist {
  .item {
    width: 25%;
    display: inline-block;
    text-align: center;
    margin: 12px 0;
    padding: 0 4px;
    box-sizing: border-box;
    color: $--color-deepgray;

    &:active {
      opacity: 0.5;
    }

    span {
      font-size: 14px;
      line-height: 24px;
      color: $--color-menugray;
    }

    img {
      width: 50%;
      display: inline-block;
    }

    .img-icon {
      display: inline-block;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-position: center center;
      background-size: contain;
      background-repeat: no-repeat;
    }

    .img-icon-allapplication{
      background-image: url(../../../assets/img/ic_qb_3x.png);
    }

    .img-icon-1 {
      background-image: url(../../../assets/img/ic_mayd@3x.png);
    }
  }
}
</style>
