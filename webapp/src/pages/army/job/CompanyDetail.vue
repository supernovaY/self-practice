<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div v-if="!pagestatus.nodata">
          <div class="container">
            <Common-PageDevideHeight />
            <!-- 图片轮播 -->
            <div class="j-m" v-if="detail.photo && JSON.parse(detail.photo).length > 0">
              <div class="cover-swiper">
                <div class="couver-count">
                  <span class="far fa-image"></span> {{ JSON.parse(detail.photo).length }}
                </div>
                <div>
                  <van-swipe :autoplay="3000" indicator-color="white">
                    <van-swipe-item
                      v-for="(item, index) in JSON.parse(detail.photo)"
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
          <ul class="info">
            <li>
              <h3 class="title">{{detail.enterpriseName}} <i class="important" v-if="detail.isStrategyCooperation">战略合作企业</i></h3>
              <ul class="descr">
                <li>{{detail.scope}}人</li>
                <li>{{detail.enterpriseType}}</li>
                <li>{{detail.industry}}</li>
              </ul>
              <div class="details">
                <div class="location">
                  <span class="text">{{detail.address}}</span>
                  <van-button type="info" size="mini" @click="$Common.openMapNav(detail.address, detail.longitude, detail.latitude)">导航</van-button>
                </div>
              </div>
            </li>
            <li>
              <h3>联系方式</h3>
              <div class="details">
                <div class="phone" v-if="detail.contactPhone">
                  <Common-PhoneCall :telephone="detail.contactPhone" />
                  <span class="name" v-if="detail.contactPerson">（{{detail.contactPerson}}）</span>
                </div>
                <div class="email" v-if="detail.email">{{detail.email}} <span class="copy" @click="$Common.copyText(detail.email)"></span></div>
              </div>
            </li>
            <li>
              <h3>公司简介</h3>
              <div class="details" v-html="detail.enterpriseProfile"></div>
            </li>
            <li>
              <h3>该企业正在招聘</h3>
              <div class="details">
                <job-item v-for="(item, index) in jobData" :key="index" :detail="item" />
                <van-empty v-if="pagestatus.noJob" description="暂无招聘岗位" />
              </div>
            </li>
          </ul>
          <Common-PageFooter />
        </div>
        <!-- 无数据 -->
        <van-empty v-if="pagestatus.nodata" description="暂无数据" />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import JobItem from './JobItem.vue'
export default {
  components: {
    JobItem
  },
  data () {
    return {
      // 页面状态控制
      pagestatus: {
        // 不存在
        nodata: false,
        // 展开/闭合详情内容
        showhidecontent: true,
        noJob: false
      },
      // 详情信息
      detail: {},
      jobData: []
    }
  },
  watch: {
    // 监听路由 ID变化
    '$route.params.id' () {
      this.F_loadCompanyDetail()
      this.F_loadJobList()
    }
  },
  mounted () {
    this.F_loadCompanyDetail()
    this.F_loadJobList()
  },

  methods: {
    async F_loadCompanyDetail () {
      this.$Common.showLoading(true)
      const data = await this.$Api.army.job.getEnterpriseDetail(
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
    async F_loadJobList () {
      this.$Common.showLoading(true)
      const data = await this.$Api.army.job.listEnterpriseStation(
        this.$route.params.id
      )
      // console.log(data)
      this.$Common.showLoading(false)
      if (data.code === 2000 && data.result && data.result.length) {
        this.pagestatus.noJob = false
        this.jobData = data.result
        return
      }
      this.pagestatus.noJob = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  background: #fff;
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
    height: 90px;
  }
}
ul.info{
  &>li{
    padding: 10px 16px;
    background: #fff;
    margin-bottom: 8px;
    &:last-child{
      border: none;
    }
    .details{
      font-size: 14px;
      color: $--color-menugray;
      line-height: 1.5;
      ::v-deep .item{
        padding: 10px 0 0;
        border-bottom: 1px solid #E7E7E7;
        &:last-child{
          border: none;
        }
      }
    }
    .phone {
      font-size: 12px;
      padding:5px 0 5px 18px;
      background: url("../../../assets/img/businessstart/ic_phone_l@3x.png") left 3px/16px no-repeat;
    }
    .location {
      position: relative;
      color: $--color-menugray;
      font-size: 12px;
      padding:5px 0 5px 18px;
      background: url("../../../assets/img/businessstart/ic_dw@3x.png") left 3px/16px no-repeat;
      line-height: 1.25;
      .van-button{
        padding: 2px 10px;
        position: absolute;
        right: 0;
        top: 0px;
      }
    }
    .email{
      font-size: 12px;
      padding:5px 0 5px 18px;
      background: url("../../../assets/img/job/icon_email@3x.png") left 5px/16px no-repeat;
      .copy{
        position: relative;
        top: -2px;
        vertical-align: middle;
        width: 16px;
        height: 16px;
        display: inline-block;
        margin-left: 5px;
        background: url("../../../assets/img/job/icon_copy@3x.png") left center/16px no-repeat;
      }
    }
    .descr{
      color: $--color-menugray;
      font-size: 14px;
      padding: 5px 0 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid #E7E7E7;
      &>li{
        display: inline-block;
        line-height: 1;
        border-right: 1px $--color-menugray solid;
        padding-right: 5px;
        margin-right: 5px;
        &:last-child{
          border: none;
        }
      }
    }
  }
  h3 {
    margin: 0;
    padding: 10px 0;
    font-size: 22px;
    font-weight: bold;
    color: #404956;
    &.title{
      font-size: 18px;
      font-weight: normal;
      line-height: 1.5;
      .important{
        vertical-align: middle;
        display: inline-block;
        margin-left: 7px;
        position: relative;
        padding: 5px 8px;
        line-height: 1.2;
        background: rgba(254,49,22,0.10);
        border-radius: 2px;
        color: #FE3116;
        font-size: 12px;
        font-style: normal;
        &:before{
          position: absolute;
          content: "";
          left: -6px;
          top: 9px;
          width: 0;
          height: 0;
          border: 3px transparent solid;
          border-right-color: rgba(254,49,22,0.10);
        }
      }
    }
  }
}
</style>
