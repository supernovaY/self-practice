<template>
  <div>
    <Common-PageContainer @scrollLoad="F_scrollLoad" :showToTop="true">
      <template v-slot:content>
        <div class="container">
          <van-swipe-cell
            v-for="(item,index) in data.list"
            :key="index"
          >
            <van-cell>
              <template #title>
                <div class="j-flex j-flex-center">
                  <div class="listicon">
                    <span class="fas fa-user j-fc-blue"></span>
                  </div>

                  <div class="flex">
                    <div class="list-title">
                      <div class="j-common-txtoverflow">
                        {{ item.name || '' }}
                      </div>
                    </div>

                    <div class="extrainfo">
                      <div class="j-fc-gray">
                        {{ item.cardNo || '' }}
                      </div>

                      <div>
                        <Common-PhoneCall :telephone="item.phone || ''" />
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </van-cell>

            <template #right>
              <van-button
                @click="F_delItemConfirm(item,index)"
                type="danger"
                text="删除"
              />
            </template>
          </van-swipe-cell>

          <!-- 到底加载结束 -->
          <Common-ListEnd v-if="pagestatus.end" />

          <!-- 无数据 -->
          <van-empty v-if="pagestatus.nodata" description="暂无账号信息" />

          <!-- 加载动画 -->
          <Common-ListLoading v-show="pagestatus.loading" />
        </div>

        <Common-PageFooter />

        <div class="j-common-bottomheightfix"></div>
      </template>

      <template #fixbottom>
        <div class="j-m">
          <Common-PageDevideHeight />

          <van-button type="info" size="large" @click="$router.push('/merchant/subaccount/add')">
            新建账号
          </van-button>

          <Common-PageDevideHeight />
        </div>
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
        start: 0,
        limit: 20,

        // 商户ID
        id: ''
      },

      // 数据存放对象
      data: {
        list: []
      }
    }
  },

  computed: mapState({
    // 商户机构信息存放
    merchantInfo (state) {
      return state.localData.merchantInfo
    }
  }),

  mounted () {
    // 设置搜索商户ID
    this.searchdata.id = this.merchantInfo.id

    this.F_loadData()
  },

  methods: {
    // 删除确认
    F_delItemConfirm (item, index) {
      this.$dialog.confirm({
        title: '删除确认',
        message: '确定删除该账号（' + item.name + '）吗？'
      }).then(() => {
        this.F_delItem(item, index)
      }).catch(() => {
        // on cancel
      })
    },

    // 删除
    async F_delItem (item, index) {
      this.$Common.showLoading(true)

      const data = await this.$Api.merchant.delSubAccount({
        id: item.relId,
        merchantId: this.merchantInfo.id
      })

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.$toast('删除成功')
        this.data.list.splice(index, 1)

        if (this.data.list.length <= 0) {
          this.F_reset()
        }
        return
      }

      this.$toast(data.message)
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
      this.searchdata.start = 0

      this.pagestatus.nodata = false
      this.pagestatus.end = false
      this.pagestatus.loading = false

      this.F_loadData()
    },

    // 加载消息数据
    async F_loadData () {
      this.pagestatus.loading = true

      const data = await this.$Api.merchant.getSubAccount(
        this.searchdata
      )

      this.pagestatus.loading = false

      if (data.code !== 2000) {
        if (this.searchdata.start === 0) {
          this.pagestatus.nodata = true
        }

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
    font-size: 22px;
    margin-right: 10px;
  }

  .extrainfo{
    line-height: 1.6;
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
