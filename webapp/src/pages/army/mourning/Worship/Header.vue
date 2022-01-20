<template>
  <div class="container">
    <img class="worshipbk" src="../../../../assets/img/mouring/img_tombstone@3x.png" />

    <!-- 花 上香 酒 -->
    <div class="animate-other">
      <img :style="pagestatus.showflower ? '' : 'opacity: 0;'" class="flower" src="../../../../assets/img/mouring/img_flower@2x.png" />
      <img :style="pagestatus.showxiang ? '' : 'opacity: 0;'" class="xiang" src="../../../../assets/img/mouring/img_xianglu@2x.png" />
      <img :style="pagestatus.showwine ? '' : 'opacity: 0;'" class="wine" src="../../../../assets/img/mouring/img_wine@2x.png" />
    </div>

    <!-- 鞠躬动画 -->
    <div v-if="pagestatus.showjigong" class="animate-jugong">
      <img src="../../../../assets/img/mouring/action.gif" />
    </div>

    <!-- 英烈信息 -->
    <div class="martyrinfo">
      <div class="martyrinfo-avatar" :style="avatar ? 'background-image:url('+ avatar +')' : ''"></div>

      <div class="martyrinfo-name j-common-txtoverflow">
        {{ detail.name }} 烈士
      </div>

      <div class="martyrinfo-year">
        {{ detail.birthYear }}-{{ detail.sacrificeYear }}
      </div>
    </div>

    <!-- 祭拜数据 -->
    <div class="worship-info">
      <div class="j-m">
        <div class="j-flex j-flex-center">
          <div class="flex">
            <div class="info-item" @click="F_flower">
              <div class="j-flex j-flex-center">
                <div class="img-c">
                  <img src="../../../../assets/img/mouring/icon_flower@3x.png" />
                </div>
                <div>
                  <div class="title">向英烈献花</div>
                  <div class="user-action-data j-fc-gray">
                    已有<span class="j-fc-blue">{{ detail.flowerCnt }}</span>人献花
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="block-width"></div>

          <div class="flex">
            <div class="info-item" @click="F_animiteJugong">
              <div class="j-flex j-flex-center">
                <div class="img-c">
                  <img src="../../../../assets/img/mouring/icon_bow@3x.png" />
                </div>
                <div>
                  <div class="title">向英烈鞠躬</div>
                  <div class="user-action-data j-fc-gray">
                    已有<span class="j-fc-orange">{{ detail.bowCnt }}</span>人鞠躬
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Common-PageDevideHeight></Common-PageDevideHeight>

        <div class="j-flex j-flex-center">
          <div class="flex">
            <div class="info-item" @click="F_wine">
              <div class="j-flex j-flex-center">
                <div class="img-c">
                  <img src="../../../../assets/img/mouring/icon_wine@3x.png" />
                </div>
                <div>
                  <div class="title">向英烈敬酒</div>
                  <div class="user-action-data j-fc-gray">
                    已有<span class="j-fc-red">{{ detail.toastCnt }}</span>人敬酒
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="block-width"></div>

          <div class="flex">
            <div class="info-item" @click="F_xiang">
              <div class="j-flex j-flex-center">
                <div class="img-c">
                  <img src="../../../../assets/img/mouring/icon_xiang@3x.png" />
                </div>
                <div>
                  <div class="title">向英烈上香</div>
                  <div class="user-action-data j-fc-gray">
                    已有<span class="j-fc-green">{{ detail.incenseCnt }}</span>人上香
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 操作间隔时间 3s
      waitTime: 3000,

      // 状态控制
      pagestatus: {
        // 当前是否正在动画中 动画中无法触发其他动画事件
        animating: false,

        // 鞠躬显示控制
        showjigong: false,

        // 花朵显示控制
        showflower: false,

        // 酒 显示控制
        showwine: false,

        // 香 显示控制
        showxiang: false
      },

      // 烈士详情
      detail: {},

      // 上次操作时间
      actionTime: {
        flower: 0,
        bow: 0,
        toast: 0,
        incense: 0
      }
    }
  },

  computed: {
    // 烈士头像
    avatar () {
      const photos = this.$Common.kJsonParse(this.detail.photo)
      return photos && photos.length > 0 ? photos[0] : ''
    }
  },

  mounted () {
    this.F_loadData()
  },

  methods: {
    // 加载详情信息
    async F_loadData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.mourn.martyrDetail(this.$route.query.id)

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.detail = data.result
        this.$emit('martyinfo', this.detail)
        return
      }

      this.$toast('烈士详情获取失败')
    },

    // 提交动作
    // 动作类型列表 鲜花：flower 鞠躬：bow 敬酒：toast 上香：incense
    async F_doRespect (type, callback) {
      const now = new Date().getTime()

      if (this.actionTime[type] > now - this.waitTime) {
        this.$toast('操作频繁，请稍后')
        return
      }
      this.$Common.showLoading(true)

      const data = await this.$Api.mourn.sacrifice({
        martyrCode: this.detail.martyrCode,
        type: type
      })

      // console.log(data)
      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.actionTime[type] = now
        // this.$toast('您的心意我们已收到')
        callback()
        return
      }

      this.$toast('操作失败')
    },

    // 上香
    F_xiang () {
      if (this.actionTime.incense) {
        return
      }

      this.F_doRespect('incense', () => {
        this.pagestatus.showxiang = true
        this.detail.incenseCnt++
      })
    },

    // 禁酒
    F_wine () {
      if (this.actionTime.toast) {
        return
      }

      this.F_doRespect('toast', () => {
        this.pagestatus.showwine = true
        this.detail.toastCnt++
      })
    },

    // 献花
    F_flower () {
      if (this.actionTime.flower) {
        return
      }

      this.F_doRespect('flower', () => {
        this.pagestatus.showflower = true
        this.detail.flowerCnt++
      })
    },

    // 显示鞠躬动画
    F_animiteJugong () {
      this.F_doRespect('bow', () => {
        this.pagestatus.showjigong = true
        this.pagestatus.animating = true

        this.detail.bowCnt++
        setTimeout(() => {
          this.pagestatus.animating = false
          this.pagestatus.showjigong = false
        }, 5000)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.show-animation{

}

.container{
  position: relative;

  .animate-other{
    position: absolute;
    z-index: 1;
    left: 0;
    right: 0;
    bottom: 160px;
    text-align: center;

    img{
      display: inline-block;
      width: 60px;
      margin: 0 10px;
      transition: all .6s;
    }

    img.xiang{
      width: 40px;
      transform: translateY(18px);
    }

    img.wine{
      transform: translateY(5px);
    }
  }

  .animate-jugong{
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
  }

  .martyrinfo{
    position: absolute;
    top: 88px;
    left: 130px;
    right: 130px;

    .martyrinfo-avatar{
      width: 90%;
      margin: 0 auto;
      height: 60px;
      background: url(../../../../assets/img/mouring/img_lieshi@3x.png) no-repeat center center;
      background-size: contain;
    }

    .martyrinfo-name{
      font-weight: bold;
      font-size: 16px;
      text-align: center;
      line-height: 40px;
    }

    .martyrinfo-year{
      text-align: center;
    }
  }

  .worshipbk{
    width: 100%;
  }

  .worship-info{
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;

    .block-width{width: 10px;}

    .info-item{
      background: rgba(0,0,0,.3);
      margin: 0;
      padding: 10px;
      border-radius: 4px;

      .title{
        color: #FFF;
      }

      .user-action-data{
        font-size: 12px;
        margin-top: 6px;
      }

      .img-c{
        margin-right: 8px;
      }
      img{
        display: block;
        width: 35px;
      }
    }
  }
}
</style>
