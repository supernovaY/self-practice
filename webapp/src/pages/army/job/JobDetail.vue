<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div v-if="!pagestatus.nodata">
          <div class="container">
            <ul class="info">
              <li>
                <h3 class="title">
                  {{detail.stationName}}
                  <i class="important" v-if="detail.isStrategyCooperation">战略合作企业岗位</i>
                  <i class="favorite" @click="collectJob" :class="detail.isCollect === 0 ? 'favorite' : 'favorite done'"></i>
                </h3>
                <div class="details">
                  <div class="salary" v-if="detail.salaryLowerLimit">{{$Common.showSalaryLabel(detail.salaryLowerLimit, detail.salaryTopLimit) + '/月'}}</div>
                  <div class="item">工作地：{{detail.workAreaName}}</div>
                  <div class="item">招聘人数：{{detail.headcount}}人 工作类型：{{detail.jobTypeName}}</div>
                  <div class="tags">
                    <van-tag plain v-if="detail.minimumEducationName">最低学历：{{detail.minimumEducationName}}</van-tag>
                    <van-tag plain v-if="detail.ageName">年龄：{{detail.ageName}}</van-tag>
                    <van-tag plain v-if="detail.workExperienceName">工作经验：{{detail.workExperienceName}}</van-tag>
                    <van-tag plain v-if="detail.serviceLengthName">服役年限：{{detail.serviceLengthName}}</van-tag>
                    <van-tag plain v-if="detail.ifMonitorName">{{detail.ifMonitorName}}</van-tag>
                    <van-tag plain v-if="detail.drivingLicenseName">需持驾照：{{detail.drivingLicenseName}}</van-tag>
                  </div>
                </div>
              </li>
              <li>
                <h3>岗位简介</h3>
                <div class="details" v-html="detail.jobDescription"></div>
              </li>
              <li>
                <h3>公司介绍</h3>
                <div class="details">
                  <div class="company" @click="showCompanyDetail(detail.enterpriseId)">
                    <div class="img">
                      <van-image fit="cover" :src="showCompanyImg" />
                    </div>
                    <div class="text">
                      <span class="name">{{detail.enterpriseName}}</span>
                      <ul class="descr">
                        <li v-if="detail.scopeName">{{detail.scopeName}}</li>
                        <li>{{detail.enterpriseTypeName}}</li>
                        <li>{{detail.industryName}}</li>
                      </ul>
                    </div>
                  </div>
                  <div class="location" v-if="detail.address">
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
                  <div class="email" v-if="detail.email">
                    {{detail.email}}
                    <span class="copy" @click="$Common.copyText(detail.email)"></span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="btn-box">
              <van-button class="btn" type="info" size="large" v-if="!detail.isApply" @click="applyJob">申请</van-button>
              <van-button class="btn" type="info" size="large" disabled v-else>已申请</van-button>
            </div>
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
      isCompleted: 0, // 完成简历
      // 页面状态控制
      pagestatus: {
        // 不存在
        nodata: false,
        // 展开/闭合详情内容
        showhidecontent: true
      },
      // 数据存放对象
      detail: {
        isApply: 0, // 申请
        isCollect: 0 // 收藏
      }
    }
  },
  watch: {
    // 监听路由 ID变化
    '$route.params.id' () {
      this.getDetail()
    }
  },
  mounted () {
    this.isResumeCompleted()
    this.getDetail()
  },
  computed: {
    showCompanyImg () {
      let photo = this.detail.photo
      if (photo && typeof photo === 'string') {
        if (JSON.parse(photo) && JSON.parse(photo).length) {
          photo = JSON.parse(photo)[0]
        }
      }
      return photo
    }
  },
  methods: {
    // 获取招聘岗位详情
    async getDetail () {
      this.$Common.showLoading(true)
      const data = await this.$Api.army.job.getJobStationDetail(
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
    },
    applyJob () {
      if (this.isCompleted === 1) {
        this.$dialog.confirm({
          title: '确定发送个人简历给企业？',
          message: '申请该岗位后，系统会将您的个人简历发送给企业，届时您的部分个人信息将会被企业知悉！'
        }).then(async () => {
          const data = await this.$Api.army.job.applyJobStation(
            this.$route.params.id
          )
          if (data.code === 2000) {
            this.detail.isApply = data.result
            this.$toast('申请成功！')
          } else {
            this.$toast(data.message)
          }
        }).catch(() => {})
      } else {
        this.$dialog.confirm({
          title: '申请失败，个人简历不完善！',
          message: '请完善您的个人简历，可点击下方“完善个人简历”按钮进入个人简历编辑页进行完善',
          confirmButtonText: '完善个人简历'
        }).then(() => {
          this.$router.push('/army/job/intentionlist')
        }).catch(() => {})
      }
    },
    async collectJob () {
      const data = await this.$Api.army.job.collectJobStation(
        this.$route.params.id
      )
      if (data.code === 2000) {
        this.detail.isCollect = data.result
        let _msg = '收藏成功！'
        if (this.detail.isCollect === 0) {
          _msg = '取消收藏！'
        }
        this.$toast(_msg)
      } else {
        this.$toast(data.message)
      }
    },
    async isResumeCompleted () {
      const data = await this.$Api.army.job.isResumeCompleted()
      if (data.code === 2000) {
        this.isCompleted = data.result
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  .btn-box{
    padding: 8px 16px;
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
  &>li{
    padding: 10px 16px;
    background: #FFF;
    margin-bottom: 8px;
    &:last-child{
      border: none;
    }
    .details{
      font-size: 14px;
      color: $--color-menugray;
      line-height: 1.5;
      .company{
        position: relative;
        overflow: hidden;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #E7E7E7;
        .img{
          width: 88px;
          height: 64px;
          float: left;
          overflow: hidden;
          border-radius: 4px;
          .van-image{
            height: 100%;
            width: 100%;
          }
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
            font-size: 12px;
            padding: 5px 15px 0 0;
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
    font-size: 22px;
    font-weight: bold;
    &.title{
      font-size: 18px;
      font-weight: normal;
      .important{
        margin-left: 7px;
        position: relative;
        padding: 5px;
        line-height: 1.2;
        background: rgba(254,49,22,0.10);
        border-radius: 2px;
        color: #FE3116;
        font-size: 10px;
        font-style: normal;
        vertical-align: middle;
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
    font-size: 16px;
    color: $--color-primary;
  }
}
</style>
