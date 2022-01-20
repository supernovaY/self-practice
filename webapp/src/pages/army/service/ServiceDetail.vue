<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div v-if="!pagestatus.nodata">
          <div class="container">
            <Common-PageDevideHeight />
            <Common-PageDevideHeight />

            <div class="service-header j-m j-flex j-flex-center">
              <div class="title">
                服务机构介绍
              </div>

              <div class="name j-fc-gray flex">
                <div class="j-common-txtoverflow">
                  {{ data.detailinfo.name || '' }}
                </div>
              </div>
            </div>

            <Common-PageDevideHeight />

            <!-- 图片轮播 -->
            <div
              class="j-m"
              v-if="data.detailinfo.images && data.detailinfo.images.length > 0"
            >
              <div class="cover-swiper">
                <div class="couver-count">
                  <span class="far fa-image"></span> {{ data.detailinfo.images.length }}
                </div>

                <div>
                  <van-swipe :autoplay="3000" indicator-color="white">
                    <van-swipe-item
                      v-for="(item,index) in data.detailinfo.images"
                      :key="index"
                    >
                      <div
                        :style="'background-image: url(' + item + ');'"
                        class="img"
                      ></div>
                    </van-swipe-item>
                  </van-swipe>
                </div>
              </div>
            </div>
            <Common-PageDevideHeight />
          </div>

          <Common-PageDevideHeight />

          <div class="container detailinfo">
            <div class="form-group nomargin-t nomargin-b">
              <div class="c lineto-txt">
                <div class="input j-flex">
                  <div class="label-msg j-fc-blue">
                    可享受服务
                  </div>
                  <div class="flex j-fc-blue right-txt">
                    <span
                      class="service-item"
                      v-for="(item,index) in data.detailinfo.label"
                      :key="index"
                    >{{ item }}</span>
                  </div>
                </div>
              </div>

              <div class="c lineto-txt">
                <div class="input j-flex">
                  <div class="label-msg">
                    服务机构类型
                  </div>
                  <div class="flex right-txt">
                    {{ data.detailinfo.serviceType || '' }}
                  </div>
                </div>
              </div>

              <div class="c lineto-txt">
                <div class="input j-flex">
                  <div class="label-msg">
                    入驻时间
                  </div>
                  <div class="flex right-txt">
                    {{ data.detailinfo.enterTime || '' }}
                  </div>
                </div>
              </div>

              <div class="c lineto-txt">
                <div class="input j-flex">
                  <div class="label-msg">
                    营业时间
                  </div>
                  <div class="flex right-txt">
                    {{ data.detailinfo.openTime || '' }}
                  </div>
                </div>
              </div>

              <div class="c lineto-txt">
                <div class="input j-flex">
                  <div class="label-msg">
                    联系方式
                  </div>
                  <div class="flex right-txt">
                    <Common-PhoneCall :telephone="data.detailinfo.phone || ''" />
                  </div>
                </div>
              </div>

              <div class="c lineto-txt">
                <div class="input j-flex">
                  <div class="label-msg">
                    地址
                  </div>
                  <div class="flex right-txt">
                    {{ data.detailinfo.area || '' }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Common-PageDevideHeight />

          <div class="container">
            <Common-PageDevideHeight />

            <div class="j-m article">
              <div
                class="j-flex j-flex-center"
                @click="pagestatus.showhidecontent = !pagestatus.showhidecontent">
                <div class="title flex">机构详情</div>
                <div class="title j-fc-blue">
                  <span
                    v-show="!pagestatus.showhidecontent"
                    class="fas fa-caret-right"></span>

                  <span
                    v-show="pagestatus.showhidecontent"
                    class="fas fa-caret-down"></span>
                </div>
              </div>

              <div
                v-show="pagestatus.showhidecontent"
                class="content"
                v-html="data.detailinfo.detail || ''"
              ></div>
            </div>

            <Common-PageDevideHeight />
          </div>

          <Common-PageFooter />
          <div class="fixbottom-height"></div>
        </div>

        <!-- 无数据 -->
        <van-empty v-if="pagestatus.nodata" description="服务机构不存在或已休业" />
      </template>

      <template #fixbottom>
        <div class="j-m" v-if="!pagestatus.nodata">
          <Common-PageDevideHeight />

          <van-button
            type="info"
            size="large"
            @click="$router.push('/army/qrcode')">
            出示老兵码
          </van-button>

          <Common-PageDevideHeight />
        </div>
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 页面状态控制
      pagestatus: {
        // 不存在
        nodata: false,

        // 展开/闭合详情内容
        showhidecontent: true
      },

      // 数据存放对象
      data: {
        // 详情信息
        detailinfo: {}
      }
    }
  },

  watch: {
    // 监听路由 ID变化
    '$route.params.id' () {
      this.F_loadServiceInfo()
    }
  },

  mounted () {
    this.F_loadServiceInfo()
  },

  methods: {
    // 加载服务机构详情
    async F_loadServiceInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.army.service.getServiceInfo(
        this.$route.params.id
      )

      // console.log(data)

      this.$Common.showLoading(false)

      if (data.code === 2000 && data.result) {
        this.pagestatus.nodata = false
        this.data.detailinfo = data.result
        return
      }

      this.pagestatus.nodata = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  background: #FFF;
}

.service-item{
  display: inline-block;
  padding: 0 3px;
}

.fixbottom-height{
  height: 100px;
}

.article{
  line-height: 1.6;

  .title{
    font-size: 20px;
  }
  .content{
    font-size: 14px;
  }
}

.detailinfo{
  font-size: 14px;

  .form-head{
    font-size: 18px;
  }
}

.cover-swiper{
  position: relative;
  border-radius: 4px;
  overflow: hidden;

  .couver-count{
    position: absolute;
    z-index: 1;
    right: 16px;
    top: 16px;
    color: #FFF;
    background: rgba(0,0,0,.5);
    border-radius: 10px;
    padding: 4px 12px;
    font-size: 14px;
  }

  .img{
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    height: 200px;
  }
}

.service-header{
  .title{
    font-size: 20px;
    margin-right: 12px;
  }

  .name{
    font-size: 16px;
    text-align: right;
  }
}
</style>

<style scoped>
.content >>> img{
  max-width: 100%;
}

.content >>> table{
  width: 100%;
  border-collapse:collapse;
}

.content >>> table td,
.content >>> table tr{
  border: 1px solid #ebedf0;
}
</style>
