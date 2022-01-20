<template>
  <div>
    <Common-PageContainer>
      <template #content>
        <div class="container">
          <div class="headerbk"></div>

          <div class="j-m">
            <div class="height-overlay"></div>

            <div class="menulist j-common-content">
              <div class="form-group" v-if="menulist.length > 0">
                <a
                  class="c lineto-txtlr noborder"
                  v-for="(item,index) in menulist"
                  :key="index"
                  @click="F_jumpUrl(item)"
                >
                  <div class="input addon j-flex j-flex-center">
                    <div class="flex">
                      {{ item.functionName }}
                    </div>
                  </div>
                </a>
              </div>

              <!-- 无数据 -->
              <van-empty
                v-if="menulist.length <= 0"
                class="j-small"
                description="暂无应用"
              />
            </div>
          </div>

          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
          <Common-PageDevideHeight />
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
      menulist: []
    }
  },

  computed: mapState({
    // 浏览器环境参数
    browerEnvStatus: 'browerEnvStatus',

    // 当前所在环境
    browerEnv: 'browerEnv'
  }),

  watch: {

  },

  mounted () {
    // 1为码上查询 2码上就医
    // console.log(this.$route.meta.type)

    this.F_loadData()
  },

  methods: {
    // 链接地址跳转
    F_jumpUrl (item) {
      this.$Common.urlJump(item.directUrl)
    },

    // 加载菜单数据
    async F_loadData () {
      this.$Common.showLoading(true)

      const data = await this.$Api.army.getAppMarketList({
        appId: this.$route.query.appid,
        authorityType: this.browerEnv
      })

      this.$Common.showLoading(false)

      if (data.code === 2000) {
        this.menulist = data.result
        return
      }

      this.$toast(data.message)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/variables.scss';

.menulist{
  position: relative;
  z-index: 1;
}

.height-overlay{
  height: 70px;
}

.headerbk{
  background: url(../../../assets/img/img_sy_top@3x.png) no-repeat left top;
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
}
</style>
