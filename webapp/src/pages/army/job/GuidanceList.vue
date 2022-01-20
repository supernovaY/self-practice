<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <div class="header">
            <h2>职业指导</h2>
            <router-link to="/army/job/character" class="link">职业性格测试 <i class="van-icon van-icon-arrow"></i></router-link>
          </div>
          <div class="j-flex j-flex-center">
            <div class="dropdownsearch flex">
              <van-sticky>
                <van-search
                  v-model="searchdata.keyword"
                  show-action
                  placeholder="请输入关键词搜索"
                  @search="F_waitRunLoad"
                  @clear="F_waitRunLoad">
                  <template #action>
                    <van-button type="default" size="small" @click="F_waitRunLoad" plain>搜索</van-button>
                  </template>
                </van-search>
              </van-sticky>
            </div>
          </div>
          <Common-PageDevideHeight />
          <div class="form-group nomargin-t">
            <ul class="list" >
              <li
                v-for="(item, index) in data.list"
                :key="index"
                @click="navDetail(item)">
                <div class="video" :style="item.imgcover ? {'background-image':'url('+ item.imgcover +')'} : ''">
                  <div v-if="item.type === '1'" class="play j-flex j-flex-center">
                    <div class="flex">
                      <span class="play-icon">
                        <span class="fas fa-play"></span>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="text">
                  <h3>{{ item.title }}</h3>
                  <div class="info">
                    <span class="time">{{item.createTime}}</span>
                    <span v-if="item.type === '1' && item.videoTimeLength" class="duration">
                      时长：{{ item.videoTimeLength }}
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />
          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="暂无数据" />
          <!-- 加载动画 -->
          <Common-ListLoading v-show="pagestatus.loading" />
        </div>
        <Common-PageFooter />
      </template>
    </Common-PageContainer>

    <!-- 视频播放 -->
    <van-popup v-model="pagestatus.showPlayer" class="video-popup">
      <video ref="player" class="video-player" controls :autoplay="false" :src="data.playerUrl"></video>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  data () {
    return {
      // 页面状态
      pagestatus: {
        loading: false, // 列表数据加载中
        end: false, // 到底了
        nodata: false, // 无数据

        // 显示视频播放器
        showPlayer: false
      },
      searchdata: { // 搜索对象
        start: 0,
        limit: 20,

        // 搜索关键词
        keyword: ''
      },
      timeoutlist: [], // setTimeout任务队列 运行 则取消其他
      data: { // 数据存放对象
        list: [], // 列表数据

        // 视频播放地址
        playerUrl: ''
      }
    }
  },
  computed: {
    ...mapState({
      userId () { // 老兵ID
        return this.armyInfo.id
      },
      armyInfo (state) { // 当前军人用户信息
        return state.localData.armyInfo
      }
    })
  },

  watch: {
    // 显示播放监听
    'pagestatus.showPlayer' (newV) {
      if (newV) {
        setTimeout(() => {
          this.$refs.player.play()
        }, 600)

        return
      }

      this.$refs.player.pause()
    }
  },

  mounted () {
    this.F_loadData()
  },
  methods: {
    F_waitRunLoad () { // 等待运行搜索委托
      if (this.pagestatus.loading) {
        this.timeoutlist.push(
          setTimeout(() => {
            this.F_waitRunLoad()
          }, 1000)
        )
        return
      }
      this.timeoutlist.map((item) => {
        clearTimeout(item)
      })
      this.timeoutlist = []
      this.F_reset()
      if (this.searchdata.keyword) {
        this.F_loadData()
      }
    },
    F_scrollLoad () { // 滚动加载
      if (
        this.pagestatus.loading ||
        this.pagestatus.end ||
        this.pagestatus.nodata
      ) {
        return
      }
      this.F_loadData()
    },
    F_reset () { // 重置列表
      this.data.list = []
      this.searchdata.start = 0

      this.pagestatus.nodata = false
      this.pagestatus.end = false
      this.pagestatus.loading = false
    },
    async F_loadData () { // 加载消息数据
      this.pagestatus.loading = true
      const data = await this.$Api.army.job.getJobGuidanceList(this.searchdata)
      this.pagestatus.loading = false

      if (data.code !== 2000) {
        this.$toast('数据请求失败')
        return
      }

      const list = data.result.records
      if (this.searchdata.start === 0 && (!list || list.length <= 0)) {
        this.pagestatus.nodata = true
        return
      }
      if (!list || list.length < this.searchdata.limit) {
        this.pagestatus.end = true
      }
      this.searchdata.start += this.searchdata.limit
      list.map((item) => {
        const photoList = this.$Common.kJsonParse(item.photo)
        item.imgcover = photoList && photoList.length > 0 ? photoList[0] : ''
        this.data.list.push(item)
      })
    },
    navDetail (item) {
      if (item.type === '1') {
        if (item.video && JSON.parse(item.video)) {
          this.data.playerUrl = JSON.parse(item.video)[0]
          this.F_playVideo(item)
        }
      } else {
        this.$router.push(`/army/job/guidancedetail/${item.id}`)
      }
    },

    // 播放视频
    F_playVideo (item) {
      this.pagestatus.showPlayer = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/variables.scss";

.video-player{
  max-width: 100%;
  max-height: 80%;
}
.video-popup{
  width: 90%;
  background: none;
}

.container{
  background: #FFF;
  .header{
    position: relative;
    h2{
      margin: 0;
      padding: 16px;
      font-size: 22px;
    }
    .link{
      position: absolute;
      top: 20px;
      right: 16px;
      color: $--color-primary;
      text-decoration: underline;
      .van-icon{
        vertical-align: middle;
      }
    }
  }
  ::v-deep .van-tab{
    font-size: 18px;
    color: #808DA1;
    line-height: 1;
    &.van-tab--active{
      font-size: 22px;
      color: #404956;
    }
  }
}
.list{
  &>li{
    position: relative;
    padding: 16px;
    overflow: hidden;
    &:after{
      content: " ";
      display: block;
      height: 0.02667rem;
      position: absolute;
      background: #ebedf0;
      left:16px;
      right: 16px;
      bottom: 0;
      transform: scaleY(0.5);
      &:last-child:after{
        display: none;
      }
    }
    .video{
      float: left;
      border-radius: 4px;
      width: 88px;
      height: 64px;
      position: relative;
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      background-image: url(../../../assets/img/img_jsjd_top@3x.png);

      .play{
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        text-align: center;

        .play-icon{
          border-radius: 50%;
          background: rgba(0,0,0,.5);
          color: #FFF;
          width: 25px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          display: inline-block;
          font-size: 12px;
        }
      }
    }
    .text{
      padding-left: 104px;
      h3{
        margin: 0;
        padding: 0 0 10px;
        line-height: 1.5;
        font-weight: normal;
      }
      .info{
        display: flex;
        justify-content: space-between;
        font-size: 12px;
        color: $--color-menugray;
      }
    }
  }
}
</style>
