<template>
  <div>
    <Common-PageContainer :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <Common-PageDevideHeight></Common-PageDevideHeight>

          <div class="j-m">
            <van-swipe class="swiper" :autoplay="3000">
              <van-swipe-item v-for="(item,index) in photoList" :key="index">
                <div
                  class="swiper-item"
                  :style="{'background-image':'url('+ item +')'}"
                ></div>
              </van-swipe-item>
            </van-swipe>
          </div>

          <div class="form-group nomargin-b">
            <div class="c lineto-txtlr">
              <div class="input">
                <div class="listblock-title">
                  {{ data.detail.name || '' }}
                </div>

                <div class="j-fc-gray">
                  建设时间：{{ data.detail.buildYear }}
                </div>
              </div>
            </div>

            <div class="c lineto-txtlr noborder j-fc-gray">
              <div class="input j-flex j-flex-center">
                <div class="listitem-icon">
                  <span class="fas fa-map-marker-alt"></span>
                </div>
                <div class="flex">
                  {{ data.detail.address || '' }}
                </div>
                <div>
                  <van-button
                    v-if="browerEnvStatus.zlb"
                    type="info"
                    size="mini"
                    @click="$Common.openMapNav(data.detail.address, data.detail.longitude, data.detail.latitude)">
                    导航
                  </van-button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="c">
            <div class="input">
              <div class="large-title">拥有荣誉</div>
            </div>

            <div class="input">
              <span
                v-for="(item,index) in honorList"
                :key="index"
                class="listitem-tag"
              >{{ item }}</span>
            </div>
          </div>
        </div>

        <div class="form-group">
          <div class="c">
            <div class="input">
              <div class="large-title">纪念设施简介</div>
            </div>

            <div class="input" v-html="data.detail.detail"></div>
          </div>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      // 状态控制
      pagestatus: {

      },

      // 数据存放
      data: {
        // 详情数据
        detail: {}
      }
    }
  },

  computed: mapState({
    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus',

    // 当前所在环境
    browerEnv: 'browerEnv',

    // 照片列表
    photoList () {
      const list = this.$Common.kJsonParse(this.data.detail.photo)
      return list || []
    },

    // 荣誉列表
    honorList () {
      const list = []

      list.push(this.data.detail.remembranceLevel)
      for (let i = 1; i < 7; i++) {
        const key = 'honour' + i

        if (this.data.detail[key]) {
          list.push(this.data.detail[key])
        }
      }

      return list
    }
  }),

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

      const data = await this.$Api.mourn.getRemembranceDetail(this.$route.query.id)

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.data.detail = data.result
        return
      }

      this.$toast('纪念设施详情获取失败')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.listitem-tag{
  display: inline-block;
  margin: 0 10px 5px 0;
  font-size: 10px;
  color: #FE3116;
  background: rgba(254,49,22,0.10);
  border-radius: 4px;
  padding: 2px 10px;
}

.large-title{
  font-size: 20px;
  font-weight: bold;
}

.container{
  background: #FFF;
  position: relative;

  .listitem-icon{
    margin-right: 4px;
    width: 16px;
  }

  .build-time{
    padding: 15px 0;
    font-size: 12px;
    border-bottom: 1PX solid $--color-gray;
  }

  .swiper-item{
    height: 120px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    position: relative;
  }

  .swiper{
    overflow: hidden;
    border-radius: 4px;
  }

  .bold-name{
    font-weight: bold;
  }

  .listblock-info-item{
    line-height: 1.6;
    padding: 2px 0;
  }

  .listblock-title{
    font-size: 16px;
    font-weight: bold;
  }
}
</style>
