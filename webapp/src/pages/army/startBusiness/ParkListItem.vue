<template>
  <section class="c lineto-txt" @click="F_jumpUrl">
    <div class="input j-flex">
      <div class="img" v-if="detail.photo && detail.photo.indexOf('[') === 0 && JSON.parse(detail.photo).length">
        <van-image :src="JSON.parse(detail.photo)[0]" fit="cover" />
      </div>
      <div class="flex">
        <div class="title">
          <span class="name">{{ detail.armyParkName || '' }}</span>
          <span class="level">{{ detail.armyParkLevelName }}</span>
          <span class="distance">{{ $Common.distanceFormat(detail.distance) }}</span>
          <span class="time" v-if="!detail.photo || JSON.parse(detail.photo).length === 0">成立时间：{{detail.setUpTime}}</span>
        </div>
        <div class="item phone" v-if="detail.contactPhone"><Common-PhoneCall :telephone="detail.contactPhone" /></div>
        <div class="item location">{{detail.armyParkAddress}}</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default () {
        return {}
      },
      required: true
    }
  },
  data () {
    return {
    }
  },
  methods: {
    // 跳转详情
    F_jumpUrl () {
      this.$router.push('/army/startbusiness/parkdetail/' + this.detail.id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.title{
  position: relative;
  font-size: 14px;
  color: $--color-menugray;
  & > span {
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
  }
  .name {
    color: #404956;
    max-width: 120px;
    white-space: nowrap;
    padding-right: 10px;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  .level{
    color: #1492FF;
    padding: 0 10px;
    border-left: 1px solid #E7E7E7;
  }
  .distance{
    color: #808DA1;
    padding: 0 10px;
    border-left: 1px solid #E7E7E7;
  }
  .time{
    position: absolute;
    right: 0;
    top: 6px;
    font-size: 12px;
  }
}
.item {
  font-size: 12px;
  color: #808DA1;
  padding:4px 0 4px 18px;
  background-repeat: no-repeat;
  background-size: 16px;
  background-position: left 3px;
  line-height: 1.25;
}
.phone {
  background-image: url("../../../assets/img/businessstart/ic_phone@3x.png");
  ::v-deep a{
    color: $--color-menugray !important;
  }
}
.location {
  background-image: url("../../../assets/img/businessstart/ic_dw@3x.png");
}
.j-flex{
  display: flex;
  .img{
    width: 88px;
    height: 64px;
    margin-right: 10px;
    border-radius: 4px;
    overflow: hidden;
    .van-image{
      height: 100%;
      width: 100%;
    }
  }
  .flex{
    flex: 1;
  }
}
</style>
