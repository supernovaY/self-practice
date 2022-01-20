<template>
  <div class="menulist">
    <div
      ref="menucontaint"
      class="menucontaint"
      :style="'height:' + containerHeight + ';'"
    >
      <div
        class="dragblock"
        v-for="(item, index) in menudata.menulist"
        :key="index"
        :style="item.touchmoveactive ? 'z-index:1' : ''"
      >
        <div v-show="controll.editMode" class="deletebtn">
          <div class="icon">
            <span
              @click="F_delItem(item, index)"
              class="j-fc-red fas fa-minus-circle"
            ></span>
          </div>
        </div>

        <div class="dragEventer">
          <a
            class="item"
            @click="F_jumpUrl(item)"
            :style="controll.editMode ? 'pointer-events: none;' : ''"
          >
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
    </div>
  </div>
</template>

<script>
/**
 * 菜单拽托排序组件
 */
import alloyfinger from '@/assets/js/alloyfinger/alloyfinger'
import dataCounter from '@/assets/js/datacounter/counter.js'

export default {
  name: 'MenuOrderEditor',

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
    return {
      // 菜单项的尺寸
      width: 0,
      height: 0,
      containerHeight: '',

      // 数据存放
      data: {
        // 菜单dom点列表
        domItemList: []
      }
    }
  },

  watch: {
    // 监听菜单数量变化
    'menudata.menulist' () {
      setTimeout(() => {
        this.F_sortPosition()
      }, 100)
    }
  },

  beforeDestroy () {
    // 解绑事件
    this.$Common.kunbindEvent(this.resizeEventId)
  },

  mounted () {
    this.F_sortPosition()

    // 监听窗口变化事件
    this.resizeEventId = this.$Common.kbindEvent(window, 'resize', () => {
      this.F_sortPosition()
    })
  },

  methods: {
    // 横坐标匹配参数配置
    F_areaDealX (num, type) {
      let pathX = -1

      const configlist =
        type === 'x'
          ? [
            [-0.3, 0.3],
            [0.6, 1.4],
            [1.6, 2.4],
            [2.6, 3.4]
          ]
          : [
            [-0.3, 0.2],
            [0.6, 1.4],
            [1.6, 2.4],
            [2.6, 3.4]
          ]

      configlist.map((item, index) => {
        if (num >= item[0] && num <= item[1]) {
          pathX = index
        }
      })

      return pathX
    },

    // 位置匹配替换的对象
    F_patchItem (translateX, translateY) {
      // console.log(translateX, translateY)

      const x = translateX / this.width
      const y = translateY / this.height

      // console.log(x, y)

      const patchX = this.F_areaDealX(x, 'x')
      const patchY = this.F_areaDealX(y, 'y')

      // console.log('匹配坐标', patchX, patchY)

      if (patchX === -1 || patchY === -1) {
        return false
      }

      const dataIndex = patchX + patchY * 4
      return dataIndex
    },

    // 位置排序 和 高度初始化
    F_sortPosition () {
      // console.log('触发排序')
      const list = this.$refs.menucontaint.querySelectorAll('.dragblock')
      let width
      let height

      // console.log(list)

      this.data.domItemList = list

      for (let i = 0; i < list.length; i++) {
        // 未处理 位置对象则进行处理
        if (!list[i]._Alloyfinfer) {
          this.F_initDrag(list[i])
        }

        width = list[i].offsetWidth
        height = list[i].offsetHeight

        list[i].translateY = (Math.ceil((i + 1) / 4) - 1) * height
        list[i].translateX = Math.ceil(i % 4) * width

        list[i]._startX = list[i].translateX
        list[i]._startY = list[i].translateY
        list[i]._markAlloyfinfer = i
        list[i]._Alloyfinfer = true

        list[i]._attachItem = this.menudata.menulist[i]
        this.menudata.menulist[i].dom = list[i]
      }

      this.width = width
      this.height = height

      this.containerHeight = Math.ceil(list.length / 4) * height + 'px'
    },

    // 删除
    F_delItem (item, index) {
      // console.log(item)
      this.$emit('del', { item: item, index: index })
    },

    // 地址跳转
    F_jumpUrl (item) {
      // 统计埋点
      dataCounter.menuEnterCount(item.appKey, () => {
        this.$Common.urlJump(item.directUrl)
      })
    },

    // 获取最终数据排序数据
    F_getFinalOrderList () {},

    // 初始化拽托
    F_initDrag (dom) {
      alloyfinger.Tranform(dom)

      const touchListener = dom.querySelector('.dragEventer')
      /* eslint-disable no-new */
      new alloyfinger.AlloyFinger(touchListener, {
        // 触摸移动
        pressMove: evt => {
          // 未开启编辑模式
          if (!this.controll.editMode) {
            return
          }

          evt.preventDefault()

          dom._attachItem.touchmoveactive = true

          // 下滑正数 上划负数
          dom.translateY += evt.deltaY
          dom.translateX += evt.deltaX
        },

        // 触屏结束
        multipointEnd: evt => {
          // 未开启编辑模式
          if (!this.controll.editMode) {
            return
          }

          evt.preventDefault()

          dom._attachItem.touchmoveactive = false

          // 计算新定位
          const patchItem = this.F_patchItem(dom.translateX, dom.translateY)

          // console.log(patchItem, dom._markAlloyfinfer)

          if (
            patchItem !== false &&
            patchItem < this.menudata.menulist.length &&
            patchItem !== dom._markAlloyfinfer
          ) {
            // console.log('替换')

            const exchangeItem = this.menudata.menulist[patchItem]
            const exchangeDom = exchangeItem.dom

            new alloyfinger.To(
              exchangeDom,
              'translateX',
              dom._startX,
              300,
              alloyfinger.ease
            )
            new alloyfinger.To(
              exchangeDom,
              'translateY',
              dom._startY,
              300,
              alloyfinger.ease
            )

            new alloyfinger.To(
              dom,
              'translateX',
              exchangeDom._startX,
              300,
              alloyfinger.ease
            )
            new alloyfinger.To(
              dom,
              'translateY',
              exchangeDom._startY,
              300,
              alloyfinger.ease,
              () => {
                // 进行数据位置对话
                this.menudata.menulist.sort((a, b) => {
                  return a.dom.translateY - b.dom.translateY === 0
                    ? a.dom.translateX - b.dom.translateX
                    : a.dom.translateY - b.dom.translateY
                })
              }
            )
          } else {
            new alloyfinger.To(
              dom,
              'translateX',
              dom._startX,
              300,
              alloyfinger.ease
            )
            new alloyfinger.To(
              dom,
              'translateY',
              dom._startY,
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
@import '@/assets/css/variables.scss';

.menucontaint {
  position: relative;
  overflow: hidden;

  .dragblock {
    position: absolute;
    left: 0;
    top: 0;
    width: 25%;
    box-sizing: border-box;

    .deletebtn {
      width: 100%;
      position: relative;

      .icon {
        position: absolute;
        left: 50%;
        right: 0;
        top: 4px;
        text-align: center;
        font-size: 18px;
        z-index: 1;
      }
    }
  }
}

.menulist {
  .item {
    display: block;
    text-align: center;
    margin: 0;
    padding: 12px 4px;
    box-sizing: border-box;
    color: $--color-deepgray;

    &:active {
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
