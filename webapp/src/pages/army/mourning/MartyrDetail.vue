<template>
  <div>
    <Common-PageContainer :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <Common-PageDevideHeight></Common-PageDevideHeight>
          <Common-PageDevideHeight></Common-PageDevideHeight>

          <div class="j-m">
            <div>
              <div class="j-flex j-flex-center">
                <div class="listblock-title">
                  基本信息
                </div>
                <div class="flex listblock-line"></div>
              </div>
            </div>

            <Common-PageDevideHeight></Common-PageDevideHeight>

            <div class="j-flex">
              <div class="flex">
                <div class="listblock-info-item martyr-name">
                  {{ detail.name }} 烈士
                </div>

                <div class="listblock-info-item">性别：{{ detail.sex }}</div>
                <div class="listblock-info-item">出生日期：{{ detail.birthYear ? detail.birthYear + '年' : '' }}{{ detail.birthMon ? detail.birthMon + '月' : '' }}</div>
                <div class="listblock-info-item">籍贯：{{ detail.areaCode }}</div>
                <div class="listblock-info-item">政治面貌：{{ detail.politicalFace }}</div>

                <Common-PageDevideHeight></Common-PageDevideHeight>

                <div>
                  <van-button size="small" color="#FE3116" class="btn-jisao" @click="$router.push('/army/mourning/worship?id=' + detail.id)">
                    <span class="icon-candle"></span> 纪念祭扫
                  </van-button>
                </div>
              </div>

              <div class="listitem-cover" :style="{'background-image':'url(' + photo + ')'}">
                <div v-if="!photo" class="colorname" v-html="colorname"></div>
              </div>
            </div>
          </div>

          <Common-PageDevideHeight></Common-PageDevideHeight>
          <Common-PageDevideHeight></Common-PageDevideHeight>

          <div class="j-m">
            <div>
              <div class="j-flex j-flex-center">
                <div class="listblock-title">
                  生前情况
                </div>
                <div class="flex listblock-line"></div>
              </div>
            </div>

            <Common-PageDevideHeight></Common-PageDevideHeight>

            <div>
              <div class="listblock-info-item">生前职务：{{ detail.post }}</div>
              <div class="listblock-info-item">立功情况：{{ detail.winHonour }}</div>
            </div>
          </div>

          <Common-PageDevideHeight></Common-PageDevideHeight>
          <Common-PageDevideHeight></Common-PageDevideHeight>

          <div class="j-m">
            <div>
              <div class="j-flex j-flex-center">
                <div class="listblock-title">
                  牺牲情况
                </div>
                <div class="flex listblock-line"></div>
              </div>
            </div>

            <Common-PageDevideHeight></Common-PageDevideHeight>

            <div>
              <div class="listblock-info-item">牺牲日期：{{ detail.sacrificeYear ? detail.sacrificeYear + '年' : '' }}</div>
              <div class="listblock-info-item">牺牲原因：{{ detail.sacrificeReason }}</div>
              <div class="listblock-info-item">牺牲地点：{{  detail.sacrificePlace }}</div>
              <div class="listblock-info-item">安葬地点：{{ detail.buryPlace }}</div>
            </div>
          </div>

          <Common-PageDevideHeight></Common-PageDevideHeight>
          <div class="j-m">
            <div>
              <div class="j-flex j-flex-center">
                <div class="listblock-title">
                  烈士事迹
                </div>
                <div class="flex listblock-line"></div>
              </div>
            </div>

            <Common-PageDevideHeight></Common-PageDevideHeight>

            <div>
              <div class="listblock-info-item" v-html="detail.deeds"></div>
            </div>
          </div>

          <Common-PageDevideHeight></Common-PageDevideHeight>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 详情数据
      detail: {}
    }
  },

  computed: {
    // 烈士照片
    photo () {
      if (!this.detail.photo) {
        return ''
      }

      const photos = this.$Common.kJsonParse(this.detail.photo)
      return photos ? photos[0] : ''
    },

    // 生成彩色文字
    colorname () {
      if (!this.detail.name) {
        return ''
      }

      const list = this.detail.name.split('')

      const colorList = ['#FE8516', '#ff4f1a', '#ff4e37', '#FE3116', '#FE8516', '#ff4f1a', '#ff4e37', '#FE3116']
      const strList = []

      list.map((item, index) => {
        const color = colorList[index]
        strList.push(`<div style="color:${color}">${item}</div>`)
      })

      return strList.join('')
    }
  },

  watch: {
    // 监听ID 变化
    '$route.query.id' () {
      this.F_loadData()
    }
  },

  mounted () {
    this.F_loadData()
  },

  methods: {
    // 加载详情
    async F_loadData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.mourn.martyrDetail(this.$route.query.id)

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.detail = data.result
        return
      }

      this.$toast('烈士详情获取失败')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.btn-jisao{
  line-height: 18px;
}

.icon-candle{
  display: inline-block;
  width: 18px;
  height: 18px;
  vertical-align: sub;
  background: url(../../../assets/img/mouring/ic_jnls@3x.png) no-repeat center;
  background-size: contain;
}

.container{
  background: #FFF;
  position: relative;

  .martyr-name{
    font-weight: bold;
  }

  .listblock-info-item{
    line-height: 1.6;
    padding: 2px 0;
  }

  .listitem-cover{
    height: 120px;
    width: 100px;
    margin-left: 16px;
    background: url(../../../assets/img/mouring/img_lsbg@3x.png) no-repeat center;
    background-size: cover;
    position: relative;

    .colorname{
      position: absolute;
      right: 20px;
      top: 30px;
      font-weight: bold;
      width: 14px;
      height: 70px;
      overflow: hidden;
      font-size: 14px;
      line-height: 1.3;
      text-align: center;
    }
  }

  .listblock-title{
    font-size: 16px;
    font-weight: bold;
  }

  .listblock-line{
    height: 1PX;
    background: #E7E7E7;
    margin-left: 16px;
  }
}
</style>
