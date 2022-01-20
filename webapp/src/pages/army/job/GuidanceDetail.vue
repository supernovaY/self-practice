<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div v-if="!pagestatus.nodata">
          <div class="container">
            <div class="header">
              <h2>{{ data.detailinfo.title || '' }}</h2>
              <section class="info">发布时间：{{data.detailinfo.createTime}}</section>
            </div>
            <!-- 图片轮播 -->
            <div v-if="data.photoList && data.photoList.length">
              <div class="cover-swiper">
                <div class="couver-count">
                  <span class="far fa-image"></span> {{ data.photoList.length }}
                </div>
                <div>
                  <van-swipe :autoplay="3000" indicator-color="white">
                    <van-swipe-item
                      v-for="(item, index) in data.photoList"
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
            <article v-html="data.detailinfo.content"></article>
          </div>
          <Common-PageFooter />
        </div>
        <!-- 无数据 -->
        <van-empty v-if="pagestatus.nodata" description="暂无数据" />
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
        nodata: false
      },
      // 数据存放对象
      data: {
        // 详情信息
        detailinfo: {},

        // 图片列表
        photoList: []
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
    // 加载详情
    async F_loadServiceInfo () {
      this.$Common.showLoading(true)

      const data = await this.$Api.army.job.getJobGuidanceDetail(
        this.$route.params.id
      )

      console.log(data)
      this.$Common.showLoading(false)

      if (data.code === 2000 && data.result) {
        this.pagestatus.nodata = false
        this.data.photoList = this.$Common.kJsonParse(data.result.photo) || []
        this.data.detailinfo = data.result
        return
      }

      this.pagestatus.nodata = true
    },
    showCompanyDetail (id) {
      this.$router.push('/army/job/companydetail/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  background: #fff;
  padding: 0 16px;
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
      height: 90px;
    }
  }
  .header{
    position: relative;
    padding-bottom: 15px;
    &:after{
      content: " ";
      display: block;
      height: 1px;
      position: absolute;
      background: #ebedf0;
      left: 0;
      right: 0;
      bottom: 0;
      transform: scaleY(0.5);
    }
    h2{
      margin: 0;
      font-weight: normal;
      padding: 15px 0;
    }
    .info{
      font-size: 12px;
      color: $--color-menugray;
    }
  }
  .img-box{
    border-radius: 4px;
    margin-bottom: 15px;
    overflow: hidden;
    img{
      display: block;
      width: 100%;
    }
  }
  article{
    line-height: 1.5;
    padding: 15px 0;
  }
}
</style>
