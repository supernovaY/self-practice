<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div v-if="!pagestatus.nodata">
          <div class="container">
            <h2>{{detail.title}}</h2>
            <div class="publish">
              <div class="item" v-if="detail.publishUnit">{{detail.publishUnit}}</div>
              <div class="item" v-if="detail.createTime">{{detail.createTime}}</div>
            </div>
            <ul class="info">
              <li>
                <h3>培训时间</h3>
                <div class="details">
                  <div class="time">{{detail.trainingTime}}</div>
                </div>
              </li>
              <li>
                <h3>联系方式</h3>
                <div class="details">
                  <div class="phone" v-for="(item, index) in detail.contacts" :key="index">
                    <Common-PhoneCall v-if="item.contactPhone" :telephone="item.contactPhone" />
                    <span class="name" v-if="item.contactMan">（{{item.contactMan}}）</span>
                  </div>
                </div>
              </li>
              <li>
                <h3>培训地址</h3>
                <div class="details">
                  <div class="location">
                    <span class="text">{{detail.address}}</span>
                    <van-button type="info" size="mini" @click="$Common.openMapNav(detail.address, detail.longitude, detail.latitude)">导航</van-button>
                  </div>
                </div>
              </li>
              <li>
                <h3>培训介绍</h3>
                <div class="details" v-html="detail.trainingIntroduction"></div>
              </li>
            </ul>
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
      detail: {} // 详情信息
    }
  },
  watch: {
    // 监听路由 ID变化
    '$route.params.id' () {
      this.F_loadDetailInfo()
    }
  },
  mounted () {
    this.F_loadDetailInfo()
  },

  methods: {
    // 加载适应性培训详情
    async F_loadDetailInfo () {
      this.$Common.showLoading(true)
      const data = await this.$Api.army.getApplicabilityTrainingDetail(
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
    showCompanyDetail (id) {
      this.$router.push('/army/job/companydetail/' + id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  background: url("../../../assets/img/img_rsgs_top@3x.png") top center/100% no-repeat;
  padding: 0 16px;
   h2 {
    margin: 0;
    padding: 20px 0 5px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
  }
  .publish{
    color: #fff;
    line-height: 1.5;
    padding: 10px 0;
    .item{
      display: inline-block;
      line-height: 1;
      padding-right: 5px;
      margin-right: 5px;
      border-right: 1px #fff solid;
      &:last-child{
        border: none;
      }
    }
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
    height: 90px;
  }
}
ul.info{
  padding: 10px 16px;
  background: #FFF;
  box-shadow: 0 2px 8px 0 rgba(180,193,203,0.50);
  border-radius: 4px;
  &>li{
    position: relative;
    padding-bottom: 10px;
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
    &:last-child:after{
      display: none;;
    }
    .details{
      font-size: 14px;
      color: $--color-menugray;
      line-height: 1.5;
      .company{
        position: relative;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #E7E7E7;
        .img{
          width: 88px;
          height: 64px;
          float: left;
          border-radius: 4px;
        }
        .text{
          padding-left: 96px;
          .name{
            display: block;
            font-size: 18px;
            padding-right: 60px;
            color: $--color-deepgray;
          }
          .descr{
            color: $--color-menugray;
            padding-top: 5px;
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
        &:after{
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          font-size: 14px;
          font-family: "vant-icon";
          content: "\F00A";
        }
      }
    }
    .phone {
      padding:5px 0 5px 18px;
      background: url("../../../assets/img/businessstart/ic_phone_l@3x.png") left center/16px no-repeat;
    }
    .location {
      position: relative;
      color: $--color-menugray;
      padding:5px 0 5px 18px;
      background: url("../../../assets/img/businessstart/ic_dw@3x.png") left 5px/16px no-repeat;
      line-height: 1.25;
      .text{
        display: block;
        padding-right: 50px;
      }
      .van-button{
        padding: 2px 10px;
        position: absolute;
        right: 0;
        top: 0px;
      }
    }
    .email{
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
    .time{
      padding-left: 20px;
      background: url("../../../assets/img/businessstart/ic_sj@3x.png") left center/16px no-repeat;
    }
  }
  .tags{
    margin: 10px 0 0;
    padding-top: 5px;
    border-top: 1px solid #E7E7E7;
  }
  h3 {
    position: relative;
    margin: 0;
    padding: 10px 0;
    font-size: 18px;
    font-weight: bold;
    &.title{
      font-size: 18px;
      font-weight: normal;
      .important{
        margin-left: 7px;
        position: relative;
        padding: 5px 8px;
        line-height: 1.2;
        background: rgba(254,49,22,0.10);
        border-radius: 2px;
        color: #FE3116;
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
    .favorite{
      position: absolute;
      width: 20px;
      height: 20px;
      right: 0;
      background-image: url("../../../assets/img/ic_sc_n@3x.png");
      background-size: 20px;
      &.done{
        background-image: url("../../../assets/img/ic_sc_s@3x.png");
      }
    }
  }
  .salary{
    font-size: 18px;
    color: $--color-primary;
  }
}
</style>
