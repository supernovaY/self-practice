<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div v-if="pagestatus.nodata">
          <div class="container">
            <div class="header">
              <h2>我该如何挑选我的工作</h2>
              <section class="info">省退役军人事务厅 | 2019年11月10日</section>
              <div class="viewcount">
                <span class="fas fa-eye"></span> 浏览次数：{{ 8 || '0' }}
              </div>
            </div>
            <div class="img-box">
              <img src="http://test-ex-serviceman.oss-cn-hangzhou.aliyuncs.com/null/20210520/1621508732205924.jpeg" />
            </div>
            <article>
              1、主要针对具有本市常驻户口和固定住所，在法定就业年龄内，身体健康，诚实守信，有创业愿望和具备创业条件的城镇登记失业人员、就业困难人员（含残疾人）、复员转业退役军人、高校毕业生（含大学生村官和留学回国学生）、化解过剩产能企业职工和失业人员、返乡创业农民工、网络商户、建档立卡贫困人口。
2、合法经营和有一定的自有资金，当年新招用符合上述条件人员数量达到企业现有在职职工人数30％、并与其签订1年以上劳动合同的，无拖欠职工工资、欠缴社会保险费等严重违法违规信用记录的小微企业。
以上人员个人创业担保贷款申请人包括家人没有在商业银行申请过贷款记录的，便可以申请创业政府贷款贴息。
            </article>
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
