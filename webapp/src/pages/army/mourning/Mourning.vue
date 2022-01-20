<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="headerbk"></div>

          <div class="j-m">
            <div class="height-overlay"></div>

            <van-tabs v-model="pagestatus.tabname">
              <van-tab title="烈士名录" name="MartyrList"></van-tab>
              <van-tab title="纪念设施" name="Anniversary"></van-tab>
            </van-tabs>

            <div class="j-common-content j-common-content-padding">
              <!-- 烈士名录 -->
              <MartyrList ref="MartyrList" v-show="pagestatus.tabname == 'MartyrList'"></MartyrList>

              <!-- 纪念设施 -->
              <Anniversary ref="Anniversary" v-show="pagestatus.tabname == 'Anniversary'"></Anniversary>
            </div>
          </div>
        </div>

        <Common-PageFooter />
      </template>
    </Common-PageContainer>
  </div>
</template>

<script>
import MartyrList from './Mourning/MartyrList.vue'
import Anniversary from './Mourning/Anniversary.vue'

export default {
  components: {
    MartyrList,
    Anniversary
  },

  data () {
    return {
      // 状态控制
      pagestatus: {
        tabname: 'MartyrList'
      }
    }
  },

  mounted () {

  },

  methods: {
    // 滚动加载
    F_scrollLoad () {
      this.$refs[this.pagestatus.tabname].F_loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.height-overlay{
  height: 28px;
}

.headerbk{
  background: url(../../../assets/img/mouring/img_mszs_top@3x.png) no-repeat left top;
  background-size: contain;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 226px;
}

.container{
  background: #FFF;
  position: relative;

  .j-common-content{
    position: relative;
    z-index: 1;
  }
}
</style>

<style scoped>
.container >>> .van-tabs__nav{
  background: none;
}

.container >>> .van-tab{
  color: rgba(255,255,255,.8);
}

.container >>> .van-tab--active{
  color: #FFF;
}

.container >>> .van-tabs__line{
  background-color: #FFF;
}
</style>
