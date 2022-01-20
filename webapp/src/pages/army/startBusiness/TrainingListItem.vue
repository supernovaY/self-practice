<template>
  <a class="c lineto-txt" @click="F_jumpUrl">
    <div class="input j-flex">
      <div class="flex">
        <div class="title">
          <span class="name">{{article.trainingName}}</span>
          <span class="type">{{article.trainingTypeName}}</span>
        </div>
        <div class="info">
          <span class="time">
            {{article.trainingStartTime}}～{{article.trainingEndTime}}
            <i class="status" v-if="article.trainingStatus === '2'">{{article.trainingStatusName}}</i>
            <i class="status active" v-if="article.trainingStatus === '1'">{{article.trainingStatusName}}</i>
            <i class="status disabled" v-if="article.trainingStatus === '3'">{{article.trainingStatusName}}</i>
          </span>
          <span class="phone" v-if="article.contactPhone"><Common-PhoneCall :telephone="article.contactPhone" :underline="true" /></span>
          <span class="location" v-if="article.address">{{article.address}}</span>
        </div>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  props: {
    article: {
      default () {
        return {}
      },
      required: true
    }
  },

  computed: {
  },

  methods: {
    // 跳转阅读详情
    F_jumpUrl () {
      this.$router.push('/army/startbusiness/trainingdetail/' + this.article.id)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.label-container{
  display: inline-block;
  margin: 0 4px 4px 0;
  font-size: 12px;
  .van-tag{
    padding: 2px 8px;
  }
}
.flex{
  position: relative;
}
.img{
  width: 88px;
  height: 58px;
  margin-right: 10px;
  border-radius: 4px;
  overflow: hidden;
  .van-image{
    height: 100%;
  }
}
.title{
  position: relative;
  padding: 5px 0;
  .name{
    font-size: 18px;
    display: block;
    width: 200px;
    padding-right: 120px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .type{
    position: absolute;
    right: 0;
    top: 5px;
    font-size: 12px;
    color: $--color-menugray;
  }
}
.info{
  &>span{
    position: relative;
    display: block;
    color: $--color-menugray;
    padding:4px 0 4px 18px;
    background-repeat: no-repeat;
    background-size: 16px;
    background-position: left 3px;
    line-height: 1.25;
    &.time {
      background-image: url("../../../assets/img/businessstart/ic_sj@3x.png");
    }
    &.phone {
      background-image: url("../../../assets/img/businessstart/ic_phone_l@3x.png");
    }
    &.location {
      background-image: url("../../../assets/img/businessstart/ic_dw@3x.png");
    }
    .status{
      position: absolute;
      right: 0;
      top: 0;
      font-style: normal;
      background: rgba(254,49,22,0.10);
      color: #FE3116;
      padding: 5px 8px;
      font-size: 12px;
      line-height: 1.2;
      border-radius: 2px;
      &.active{
        background: rgba(20,146,255,0.10);
        color: $--color-primary;
      }
      &.disabled{
        background: rgba(128,141,161,0.10);
        color: $--color-menugray;
      }
    }
  }
}

</style>
