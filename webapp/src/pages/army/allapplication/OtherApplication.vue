<template>
  <div class="menulist">
    <div v-for="(item, index) in menudata.othermenu" :key="index" class="item">
      <div v-show="controll.editMode" class="addbtn">
        <div class="icon">
          <span
            @click="F_addItem(item, index)"
            class="j-fc-blue fas fa-plus-circle"
          ></span>
        </div>
      </div>

      <a
        @click="F_jumpUrl(item)">
        <div>
          <span
            class="img-icon"
            :style="'background-image:url(' + item.icon + ')'"
          ></span>
        </div>
        <span class="menutxt">{{ item.appTitle }}</span>
      </a>
    </div>
  </div>
</template>

<script>
import dataCounter from '@/assets/js/datacounter/counter.js'

export default {
  props: {
    menudata: {
      type: Object,
      required: true
    },

    // 编辑模式控制
    controll: {
      type: Object,
      default () {
        return {
          editMode: false
        }
      }
    }
  },

  data () {
    return {}
  },

  mounted () {},

  methods: {
    // 添加常用
    F_addItem (item, index) {
      this.$emit('add', { item: item, index: index })
    },

    // 链接跳转
    F_jumpUrl (item) {
      if (this.controll.editMode) {
        return
      }

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
    position: relative;
    text-align: center;
    margin: 0;
    padding: 12px 4px;
    box-sizing: border-box;
    color: $--color-deepgray;

    .addbtn {
      position: absolute;
      left: 50%;
      right: 0;
      top: 4px;
      z-index: 1;
      text-align: center;

      .icon {
        font-size: 18px;
      }
    }

    a:active {
      opacity: 0.5;
    }

    .menutxt {
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

    .img-icon-1 {
      background-image: url(../../../assets/img/ic_mayd@3x.png);
    }
  }
}
</style>
