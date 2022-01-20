<template>
  <div class="item">
    <a class="c lineto-txt" @click="F_jumpUrl">
      <div :class="detail.upOrDown === '0' ? 'input disabled' : 'input'">
        <div class="time" v-if="type === 1">申请时间：{{detail.createTime}}</div>
        <div class="time" v-if="type === 2">收藏时间：{{detail.createTime}}</div>
        <div class="time" v-if="type === 3">{{detail.createTime}}</div>
        <div class="flex">
          <div class="title">
            <span class="name">{{detail.stationName}}</span>
            <span class="important" v-if="detail.isStrategyCooperation">战略合作企业岗位</span>
            <span class="salary">{{$Common.showSalaryLabel(detail.salaryLowerLimit, detail.salaryTopLimit) + '/月'}}</span>
          </div>
          <div class="tags">
            <van-tag type="primary" v-if="detail.serviceLength">服役{{detail.serviceLength}}年以下</van-tag>
            <van-tag type="primary" v-if="detail.ifMonitor === '1'">当过班长</van-tag>
            <van-tag type="primary" v-if="detail.education">{{detail.education}}</van-tag>
            <van-tag type="primary" v-if="detail.age">{{detail.age}}岁以下</van-tag>
            <van-tag type="primary" v-if="detail.workExperience">工作{{detail.workExperience}}年以上</van-tag>
            <van-tag type="primary" v-if="detail.drivingLicense">{{detail.drivingLicense}}驾驶证</van-tag>
          </div>
          <ul class="info">
            <li>{{detail.enterpriseName}}</li>
            <li>工作地点：{{detail.areaCode || detail.workAreaName}}</li>
            <li>招聘人数：{{detail.headcount}}人</li>
          </ul>
        </div>
      </div>
      <div class="closed" v-if="type !== '' && detail.upOrDown === '0'">岗位已关闭</div>
    </a>
  </div>
</template>

<script>
export default {
  props: {
    detail: {
      default () {
        return {}
      },
      required: true
    },
    type: {
      type: Number,
      default: 0 // '1'申请记录 '2'岗位收藏 '3'浏览记录
    }
  },
  data () {
    return {
      tags: []
    }
  },
  mounted () {
  },
  methods: {
    // 跳转阅读详情
    F_jumpUrl () {
      this.$router.push('/army/job/jobdetail/' + this.detail.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
}

.divideheight-8{
  height: 8px;
}

.datetext{
  margin-left: 10px;
  color: #808DA1;
}
.time{
  height: 44px;
  line-height: 44px;
  padding: 0 16px;
  margin: 0 -16px;
  background: #F4FAFF;
  color: $--color-menugray;
}
.disabled{
  opacity: 0.36;
}
.closed{
  background: #F7F8FA;
  border-top: 1px solid #EBEDF0;
  height: 36px;
  line-height: 36px;
  text-align: center;
}
.title{
  position: relative;
  padding-top: 10px;
  &>span{
    display: inline-block;
    vertical-align: middle;
  }
  .name{
    font-size: 16px;
    color: #404956;
  }
  .important{
    font-size: 10px;
    margin-left: 7px;
    position: relative;
    padding: 5px;
    line-height: 1.2;
    background: rgba(254,49,22,0.10);
    border-radius: 2px;
    color: #FE3116;
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
  .salary{
    position: absolute;
    right: 0;
    font-size: 16px;
    color: $--color-primary;
  }
}
.info{
  &>li{
    display: inline-block;
    margin-right: 8px;
    color: #808DA1;
    font-size: 14px;
  }
}
</style>
