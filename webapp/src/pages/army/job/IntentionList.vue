<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <h2>管理求职意向</h2>
          <p class="notice">根据求职意向智能推荐适合您的岗位</p>
          <div class="info">
            <!-- 无数据 -->
            <van-empty v-if="data.jobPreferList.length <= 0" description="未添加求职意向" />

            <ul v-if="data.jobPreferList.length > 0">
              <li
                v-for="(item,index) in data.jobPreferList"
                :key="index"
                @click="updateIntention(item.id)">
                <div class="title">
                  <span class="name">{{ item.stationName }}</span>
                  <span class="salary">{{ $Common.showSalaryLabel(item.salaryLowerLimit, item.salaryTopLimit) + '/月' }}</span>
                </div>
                <div class="tags">
                  <van-tag plain>{{ item.industryName }}</van-tag>
                </div>
                <span class="area">{{ item.areaName }}</span>
              </li>
            </ul>

            <div
              v-if="data.jobPreferList.length < 3 && armyInfo.id"
              class="btn-box">
              <button type="button" class="add" @click="updateIntention('new')"><i class="van-icon van-icon-add-o"></i>添加求职意向</button>
            </div>
          </div>

          <div v-if="data.resumeInfo.armyInfo && armyInfo.id" class="resume">
            <div class="title">
              <h3>个人简历</h3>
              <i class="edit" @click="updateResume('1')"></i>
            </div>
            <div class="detail">
              <h4>{{ data.resumeInfo.armyInfo.userName }}</h4>
              <p class="summary">
                {{ data.resumeInfo.armyInfo.condition.join(' / ') }}
              </p>
              <dl>
                <dt>联系方式：</dt>
                <dd>{{ data.resumeInfo.armyInfo.contactPhone }}</dd>
              </dl>
              <dl>
                <dt>持有驾照：</dt>
                <dd>{{ data.resumeInfo.armyInfo.driveLincenseName }}</dd>
              </dl>
            </div>
            <div class="work">
              <h4>工作经历</h4>
              <ul>
                <li
                  v-for="(item,index) in data.resumeInfo.workExperienceList"
                  :key="index">
                  <div class="header">
                    <span class="name">{{ item.enterpriseName }}</span>
                    <span class="time">
                      {{ item.jobStartTime }}
                      -
                      {{ item.jobEndTime || '至今' }}
                    </span>
                  </div>
                  <b class="job-title">{{ item.stationName }}</b>
                  <p class="detail">
                    {{ item.workContent }}
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <!-- 无数据 -->
          <van-empty v-if="!data.resumeInfo.armyInfo" description="暂无简历信息" />

          <div v-if="!data.resumeInfo.armyInfo && armyInfo.id">
            <div class="btn-box">
              <button type="button" class="add" @click="updateResume('0')"><i class="van-icon van-icon-add-o"></i>添加简历信息</button>
            </div>
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
      // 页面状态控制
      pagestatus: {
        // 不存在
        nodata: false,
        // 展开/闭合详情内容
        showhidecontent: true
      },

      // 数据存放对象
      data: {
        // 最多可添加三个求职意向
        max: 3,

        // 就业职位意向列表
        jobPreferList: [],

        // 简历和工作经验
        resumeInfo: {}
      }
    }
  },

  computed: mapState({
    // 当前军人用户信息
    armyInfo (state) {
      return state.localData.armyInfo
    }
  }),

  mounted () {
    this.F_loadJobPrefer()
    this.F_loadResume()
  },

  methods: {
    // 加载我的求职意向
    async F_loadJobPrefer () {
      const data = await this.$Api.army.job.getJobPrefer(this.armyInfo.id)

      // console.log(data)

      if (data.code === 2000) {
        this.data.jobPreferList = data.result
      }
    },

    // 加载简历信息
    async F_loadResume () {
      this.$Common.showLoading(true)

      const data = await this.$Api.army.job.getResumeAndExpirence(
        this.armyInfo.id
      )

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        // 条件列表 / 拼接
        const conditionList = ['workExperienceName', 'age', 'mineducationName', 'soldierYearName', 'ifMonitorName']
        const condition = []

        conditionList.map((item) => {
          if (data.result.armyInfo[item]) {
            if (item === 'age') {
              data.result.armyInfo[item] += '岁'
            }

            condition.push(data.result.armyInfo[item])
          }
        })

        data.result.armyInfo.condition = condition
        this.data.resumeInfo = data.result
      }
    },

    updateIntention (id) {
      this.$router.push(`/army/job/intentionupdate/${id}`)
    },

    // 0添加 or 1更新简历
    updateResume (id) {
      this.$router.push(`/army/job/resumeupdate/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  overflow: hidden;
  background: #fff url("../../../assets/img/img_rsgs_top@3x.png") top center/100% no-repeat;
  padding: 0 16px;
  h2 {
    margin: 0;
    padding: 15px 0 5px;
    font-size: 22px;
    font-weight: bold;
    color: #fff;
  }
  .notice {
    color: #fff;
    font-size: 14px;
    margin: 5px 0 15px;
  }
  .info{
    overflow: hidden;
    background: #FFFFFF;
    box-shadow: 0 2px 8px 0 rgba(180,193,203,0.50);
    border-radius: 4px;
    li{
      position: relative;
      padding: 16px;
      line-height: 1.5;
      &:before{
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 14px;
        font-family: "vant-icon";
        content: "\F00A";
      }
      &:after{
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        right: 16px;
        bottom: 0;
        left: 16px;
        border-bottom: 1px solid #E7E7E7;
        transform: scaleY(.5);
      }
      .title{
        position: relative;
        .name {
          font-size: 18px;
          display: inline-block;
          vertical-align: middle;
        }
        .salary{
          position: absolute;
          right: 0;
          font-size: 18px;
          color: $--color-primary;
        }
      }
      .area {
        color: $--color-menugray;
        padding-top: 5px;
        display: block;
      }
    }
  }
  .btn-box{
    padding: 16px;
    .add {
      display: block;
      width: 100%;
      font-size: 14px;
      color: #1492FF;
      background: #fff;
      height: 44px;
      line-height: 42px;
      border: 1px dashed #1492FF;
      border-radius: 4px;
      .van-icon{
        margin-right: 5px;
        vertical-align: middle;
      }
    }
  }
  .resume{
    .title{
      position: relative;
      h3{
        font-size: 22px;
        padding: 20px 0 10px;
        margin: 0;
      }
      .edit{
        position: absolute;
        width: 20px;
        height: 20px;
        top: 20px;
        right: 0;
        background: url("../../../assets/img/ic_bjjl@3x.png") center center/16px no-repeat;
      }
    }
    h4{
      font-size: 18px;
      margin: 0;
      padding: 10px 0;
    }
    .detail{
      .summary{
        margin: 0;
        padding: 5px 0;
        font-size: 14px;
        color: $--color-menugray;
      }
      dl{
        color: $--color-menugray;
        font-size: 14px;
        padding: 5px 0;
        margin: 0;
        dt, dd{
          display: inline;
          margin: 0;
        }
      }
    }
    .work{
      border-top: 1px solid #E7E7E7;
      margin-top: 10px;
      padding-top: 10px;
      .header{
        position: relative;
        margin-top: 5px;
        .name{
          display: block;
          font-size: 16px;
          font-weight: bold;
          padding-right: 100px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
        .time{
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      .job-title{
        display: block;
        font-weight: normal;
        padding-top: 10px;
      }
      .detail{
        color: $--color-menugray;
        padding: 10px 0;
        margin: 0;
        line-height: 1.5;
      }
    }
  }
}
</style>
