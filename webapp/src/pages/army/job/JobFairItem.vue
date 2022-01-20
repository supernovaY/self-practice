<template>
  <div class="item">
    <a class="c lineto-txt" @click="F_jumpUrl">
      <div class="input j-flex">
        <div class="flex">
          <div class="title">
            <span class="name">{{detail.name}}</span>
            <span class="type">{{detail.jobFairTypeName}}</span>
          </div>
          <ul class="info">
            <li class="time">
              {{detail.startTime}}～{{detail.endTime}}
              <i class="status" v-if="detail.status" :class="detail.status === '2' ? 'active' : (detail.status === '3' ? 'disabled' : '')">{{detail.jobFairStatusName}}</i>
            </li>
            <li class="organizer">组织单位：{{detail.unit}}</li>
            <li class="area">{{detail.address}}</li>
          </ul>
        </div>
      </div>
    </a>
    <Common-PageDevideHeight />
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
    }
  },
  methods: {
    // 跳转阅读详情
    F_jumpUrl () {
      this.$router.push('/army/job/jobfairdetail/' + this.detail.id)
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
  color: $--color-deepgray;
}
.title{
  position: relative;
  &>span{
    display: inline-block;
  }
  .name{
    font-size: 18px;
    color: $--color-deepgray;
  }
  .type{
    position: absolute;
    right: 0;
    font-size: 12px;
    color: $--color-menugray;
  }
}
.info{
  &>li{
    display: block;
    color: $--color-menugray;
    font-size: 12px;
    padding-left: 20px;
    background-position: left center;
    background-repeat: no-repeat;
    background-size: 16px;
    &.time{
      background-image: url("../../../assets/img/businessstart/ic_sj@3x.png");
      position: relative;
      &>.status{
        position: absolute;
        right: 0;
        font-size: 12px;
        padding: 5px 8px;
        line-height: 1;
        font-style: normal;
        background: rgba(254,49,22,0.10);
        border-radius: 2px;
        color: #FE3116;
        &.active{
          color: $--color-primary;
          background: rgba(20,146,255,0.10);
        }
        &.disabled{
          background: rgba(128,141,161,0.10);
        }
      }
    }
    &.organizer{
      background-image: url("../../../assets/img/icon_organizer@3x.png");
    }
    &.area{
      background-image: url("../../../assets/img/businessstart/ic_dw@3x.png");
    }
  }
}
</style>
