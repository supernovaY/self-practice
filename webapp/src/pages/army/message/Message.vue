<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <van-swipe-cell
            v-for="(item,index) in data.list"
            :key="index"
          >
            <van-cell is-link @click="F_urlJump(item)">
              <template #title>
                <div class="j-flex j-flex-center">
                  <div :class="item.messageStatus === 0 ? 'listicon unread' : 'listicon'">
                    <span class="fas fa-volume-up j-fc-blue"></span>
                  </div>

                  <div class="flex">
                    <div class="list-title">
                      <div class="j-common-txtoverflow">
                        {{ item.title || '' }}
                      </div>
                    </div>
                    <div class="j-fc-gray">
                      {{ item.createTime || '' }}
                    </div>
                  </div>
                </div>

              </template>
            </van-cell>

            <template #right>
              <van-button @click="F_delMessage(item,index)" type="danger" text="删除" />
            </template>
          </van-swipe-cell>

          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />

          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="暂无消息" />

          <!-- 加载动画 -->
          <Common-ListLoading v-show="pagestatus.loading" />
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
      // 页面状态
      pagestatus: {
        // 列表数据加载中
        loading: false,

        // 到底了
        end: false,

        // 无数据
        nodata: false
      },

      // 搜索对象
      searchdata: {
        id: '',
        start: 0,
        limit: 20
      },

      // 数据存放对象
      data: {
        list: []
      }
    }
  },

  computed: mapState({
    // 当前军人用户信息
    Userinfo (state) {
      return state.localData.Userinfo
    }
  }),

  mounted () {
    this.searchdata.id = this.Userinfo.id

    this.F_loadData()
  },

  methods: {
    // 消息跳转
    F_urlJump (item) {
      // 设置已读状态
      if (item.messageStatus === 0) {
        this.F_setMessageReaded(item)
      }

      // 1：优惠券消息 2：岗位消息 3：政策推送消息 4：代持审核消息 5：意见反馈回复消息
      // 6：代持申请提交通知 7：退款通知 8：老兵码代持失效 9:适应性培训
      switch (item.messageType) {
        case 1:
          // 1：优惠券消息
          this.$router.push(
            '/army/couponmessage' +
            this.$Common.KhttpBuildQuery({
              couponid: item.messageObjId,
              type: item.messageContent.indexOf('过期') > -1 ? 'expire' : 'send'
            })
          )
          break

        case 2:
          break

        case 3:

          break

        // 4：代持审核消息
        case 4:
          this.$router.push('/army/incharge/applyprocess/' + item.messageObjId)
          break

        // 5：意见反馈回复消息
        case 5:
          this.$router.push(
            '/merchant/suggestionresponse' +
            this.$Common.KhttpBuildQuery({
              id: item.messageObjId
            })
          )
          break

        // 6：代持申请提交通知
        case 6:
          this.$router.push('/army/incharge/applyprocess/' + item.messageObjId)
          break

        // 退款通知
        case 7:
          this.$router.push('/merchant/orderdetail/' + item.messageObjId)
          break

        // 适应性培训通知
        case 9:
          this.$router.push('/army/index/applicabilitytraining/' + item.messageObjId)
          break
      }
    },

    // 设置已读
    F_setMessageReaded (item) {
      this.$Api.message.setReaded(item.id)
      item.messageStatus = 1
    },

    // 删除消息
    F_delMessage (item, index) {
      this.$dialog.confirm({
        title: '删除确认',
        message: '确定删除该消息吗？'
      }).then(async () => {
        this.$Common.showLoading(true)

        const data = await this.$Api.message.delItem({
          id: item.id,
          userId: this.Userinfo.id
        })

        this.$Common.showLoading(false)

        if (data.code === 2000) {
          this.data.list.splice(index, 1)
          this.$toast('信息删除成功')
        }
      }).catch(() => {

      })
    },

    // 滚动加载
    F_scrollLoad () {
      if (this.pagestatus.loading || this.pagestatus.end) {
        return
      }

      this.F_loadData()
    },

    // 重置列表
    F_reset () {
      this.data.list = []
      this.searchdata.page = 1

      this.F_loadData()
    },

    // 加载消息数据
    async F_loadData () {
      this.pagestatus.loading = true

      this.pagestatus.loading = true

      const searchdata = Object.assign({}, this.searchdata)

      const data = await this.$Api.message.getList(searchdata)

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
        this.data.list.push(item)
      })

      this.pagestatus.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.container{
  background: #FFF;

  .list-title{
    font-size: 16px;
  }

  .listicon{
    font-size: 24px;
    margin-right: 10px;
    position: relative;

    &.unread:after{
      content: '';
      display: block;
      width: 4px;
      height: 4px;
      background: $--color-red;
      border-radius: 50%;
      position: absolute;
      left: -8px;
      top: 0;
    }
  }

  .van-button{
    border-radius: 0;
    height: 100%;
  }

  .van-cell{
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }
}
</style>
