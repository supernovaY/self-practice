<template>
  <van-sticky>
    <van-swipe class="msg-list" :autoplay="3000">
      <van-swipe-item @click="F_jumpUrl(item.trainingId)" v-for="(item, index) in msgList" :key="index">
        <span class="name">{{item.title}}</span>
        <span class="time">培训时间：{{item.trainingTime}}</span>
      </van-swipe-item>
    </van-swipe>
  </van-sticky>
</template>

<script>
/**
 * 老兵码首页 适应性培训消息列表
 */
export default {
  props: {
    msgList: {
      type: Array,
      default () {
        return []
      }
    }
  },

  data () {
    return {}
  },

  methods: {
    // url 跳转处理
    F_jumpUrl (id) {
      this.$router.push(`/army/index/applicabilitytraining/${id}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.msg-list {
  height: 60px;
  background: #FFFBE8;
  color: #ED6A0C;
  .van-swipe-item{
    padding: 10px 20px 10px 40px;
    background: url("../../../assets/img/ic_syxx@3x.png") 16px 12px/16px no-repeat;
    box-sizing: border-box;
    .name, .time{
      display: block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 14px;
      line-height: 1.5;
    }
  }
  ::v-deep{
    .van-swipe__indicators{
      bottom: 4px;
      .van-swipe__indicator{
        background-color: #ED6A0C;
      }
    }
  }
}
</style>
