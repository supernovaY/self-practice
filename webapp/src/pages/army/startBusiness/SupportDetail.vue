<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div v-if="!pagestatus.nodata">
          <div class="container">
            <div class="header">
              <h2>{{detail.title}}</h2>
              <section class="info">{{detail.publishUnitName}} | {{detail.publishTime}}</section>
              <div class="viewcount">
                <span class="fas fa-eye"></span> 浏览次数：{{ detail.viewNumber || '0' }}
              </div>
            </div>
            <div class="img-box" v-if="detail.coverPhoto && detail.coverPhoto.indexOf('[') === 0">
              <img :src="JSON.parse(detail.coverPhoto)[0]" />
            </div>
            <article v-html="detail.supportContent"></article>
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
import { mapState } from 'vuex'
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
      detail: {}
    }
  },
  watch: {
    // 监听路由 ID变化
    '$route.params.id' () {
      this.F_loadServiceInfo()
    }
  },
  computed: mapState({
    // 登录用户ID
    userId () {
      return this.Userinfo.id
    },

    // 当前登录用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    }
  }),
  mounted () {
    this.F_loadServiceInfo()
    this.F_updateViewCount()
  },

  methods: {
    // 加载服务机构详情
    async F_loadServiceInfo () {
      this.$Common.showLoading(true)
      const data = await this.$Api.army.startup.getArmySupportDetail(
        this.$route.params.id
      )
      // console.log(data)
      this.$Common.showLoading(false)
      if (data.code === 2000 && data.result) {
        this.pagestatus.nodata = false
        this.detail = data.result
        return
      }
      this.pagestatus.nodata = true
    },
    // 更新阅读量
    F_updateViewCount () {
      this.$Api.army.policy.updateViewCount({
        userId: this.userId,
        type: 2, // 扶持
        objectId: this.$route.params.id
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  background: #fff;
  padding: 0 16px;
  .header{
    position: relative;
    padding-bottom: 15px;
    margin-bottom: 15px;
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
    .viewcount{
      position: absolute;
      right: 0;
      bottom: 15px;
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
    padding-bottom: 20px;
  }
}
</style>
