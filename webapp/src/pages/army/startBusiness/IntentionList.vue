<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <h2>管理创业意向</h2>
          <p class="notice">最多添加3个</p>
          <ul class="info">
            <li @click="updateIntention(item.id)" v-for="(item, index) in listData" :key="index">
              <div class="title">
                <span class="name">{{item.industryName}}</span>
                <span class="area">{{item.startupAreaCodeName}}</span>
              </div>
              <p class="remark">{{item.plan}}</p>
            </li>
          </ul>
          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="未添加创业意向" />
          <button type="button" v-if="showAddBtn" class="add" @click="updateIntention('new')"><i class="van-icon van-icon-add-o"></i>添加创业意向</button>
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
      listData: [],
      showAddBtn: false, // 显示新增创业意向按钮
      // 页面状态控制
      pagestatus: {
        // 不存在
        nodata: false,
        // 展开/闭合详情内容
        showhidecontent: true
      },
      // 数据存放对象
      data: {
        // 详情信息
        detailinfo: {}
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
    this.F_loadIntentionList()
    this.getAddBtnStatus()
  },
  methods: {
    // 加载创业意向列表
    async F_loadIntentionList () {
      this.$Common.showLoading(true)
      const data = await this.$Api.army.startup.getStartupIntentionList(this.armyInfo.id)
      this.$Common.showLoading(false)
      if (data.code === 2000 && data.result) {
        this.pagestatus.nodata = false
        this.listData = data.result
        return
      }
      this.pagestatus.nodata = true
    },
    updateIntention (id) {
      this.$router.push(`/army/startbusiness/intentionupdate/${id}`)
    },
    async getAddBtnStatus () {
      const data = await this.$Api.army.startup.isIntentionAbove(this.armyInfo.id)
      if (data.code === 2000) {
        this.showAddBtn = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";
.container{
  overflow: hidden;
  background: #FFF;
  padding: 0 16px;
  h2 {
    margin: 0;
    padding: 15px 0 5px;
    font-size: 22px;
    font-weight: bold;
  }
  .notice {
    color: $--color-menugray;
    font-size: 14px;
    margin: 5px 0 15px;
  }
  ul.info{
    &>li{
      position: relative;
      padding: 15px 0;
      &:before{
        position: absolute;
        right: 0;
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
        right: 0;
        bottom: 0;
        left: 0;
        border-bottom: 1px solid #E7E7E7;
        transform: scaleY(.5);
      }
      .title{
        .name {
          font-size: 18px;
          display: inline-block;
          vertical-align: middle;
        }
        .area {
          font-size: 12px;
          display: inline-block;
          vertical-align: middle;
          background: #F7F8FA;
          border-radius: 2px;
          padding: 5px;
          margin-left: 10px;
        }
      }
      .remark{
        margin: 0;
        color: $--color-menugray;
        font-size: 14px;
        padding: 5px 15px 0 0;
        line-height: 1.5;
        text-align: justify;
      }
    }
  }
  .add {
    display: block;
    width: 100%;
    margin: 16px 0;
    font-size: 14px;
    color: $--color-primary;
    background: #fff;
    height: 44px;
    line-height: 42px;
    border: 1px dashed $--color-primary;
    border-radius: 4px;
    .van-icon{
      margin-right: 5px;
      vertical-align: middle;
    }
  }
}
</style>
